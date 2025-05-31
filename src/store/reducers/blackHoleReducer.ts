import { blackHoleUpgrades } from "@/data/colonization/blackHoleUpgrades";
import { gameEvent } from "@/server/analytics";
import { GameState } from "@/types/gameState";

const BLACK_HOLE_CONFIG = {
  BASE_MASS_GROWTH_RATE: 0.001,
  CRITICAL_MASS_LIMIT: 1000,
  DARK_MATTER_EFFICIENCY: 0.00001,
  DARK_MATTER_DECAY_RATE: 0.999,
  MASS_TO_DARK_MATTER_RATE: 0.5,
  ENERGY_PER_SOLAR_MASS: 1000,
  HAWKING_RADIATION_FACTOR: 0.0001,
  ACCRETION_EFFICIENCY: 0.1,
  GROWTH_ACCELERATION: 1.1,
};

export const blackHoleTick = (
  state: GameState,
  deltaTime: number
): GameState => {
  if (!state?.galacticUpgrades?.includes("black_hole_unknow")) return state;

  const currentTime = Date.now();
  const blackHole = state.blackHole || {};
  const currentMass = blackHole.mass || 1;

  if (
    currentMass >=
    (blackHole.criticalMass || BLACK_HOLE_CONFIG.CRITICAL_MASS_LIMIT)
  )
    return hitCriticalMass(state);

  const currentDarkMatter = blackHole.darkMatterAmount || 0;
  const formationTime = blackHole.formationTime || currentTime;

  const growthMultiplier = Math.pow(currentMass / 10, 0.3);
  const baseGrowth =
    BLACK_HOLE_CONFIG.BASE_MASS_GROWTH_RATE *
    (1 + growthMultiplier) *
    BLACK_HOLE_CONFIG.ACCRETION_EFFICIENCY;

  const growthBonus = blackHole.massGrowthRateBonus || 0;
  const totalGrowth = baseGrowth * (1 + growthBonus);

  const newMass = Math.min(
    currentMass + totalGrowth * deltaTime,
    blackHole.criticalMass || BLACK_HOLE_CONFIG.CRITICAL_MASS_LIMIT
  );

  const massIncrease = newMass - currentMass;
  const darkMatterGenerated =
    massIncrease * BLACK_HOLE_CONFIG.DARK_MATTER_EFFICIENCY * deltaTime;

  const darkMatterDecay =
    currentDarkMatter *
    (1 - BLACK_HOLE_CONFIG.DARK_MATTER_DECAY_RATE) *
    deltaTime;

  const darkMatterBonus = blackHole.darkMatterRateBonus || 0;

  const newDarkMatter = Math.max(
    0,
    currentDarkMatter + darkMatterGenerated - darkMatterDecay + darkMatterBonus
  );

  const accretionEnergy = newMass * BLACK_HOLE_CONFIG.ENERGY_PER_SOLAR_MASS;
  const hawkingLoss =
    (BLACK_HOLE_CONFIG.HAWKING_RADIATION_FACTOR / newMass) * deltaTime;
  const netEnergyRate = Math.max(0, accretionEnergy - hawkingLoss);

  const schwarzschildRadius = newMass * 2.95;
  const hawkingTemperature = 6.17e-8 / newMass;
  const lifetimeYears = Math.pow(newMass, 3) * 6.6e-5;

  return {
    ...state,
    blackHole: {
      ...blackHole,
      formationTime,
      lastUpdate: currentTime,
      mass: newMass,
      criticalMass:
        blackHole.criticalMass || BLACK_HOLE_CONFIG.CRITICAL_MASS_LIMIT,
      darkMatterAmount: newDarkMatter,
      energyRate: netEnergyRate,
      schwarzschildRadius,
      hawkingTemperature,
      estimatedLifetime: lifetimeYears,
      totalEnergyProduced:
        (blackHole.totalEnergyProduced || 0) + netEnergyRate * deltaTime,
      ageInSeconds: (currentTime - formationTime) / 1000,
      massGrowthRate: totalGrowth,
      currentGrowthMultiplier: growthMultiplier,
    },
    resources: {
      ...state.resources,
      energy: {
        ...state.resources.energy,
        amount: Math.min(
          (state.resources.energy?.amount || 0) + netEnergyRate * deltaTime,
          state.resources.energy?.capacity || 0
        ),
      },
    },
  };
};

export const convertMassToDarkMatter = (state: GameState): GameState => {
  const mass = state.blackHole?.mass || 0;
  return {
    ...state,
    blackHole: {
      ...state.blackHole,
      darkMatterAmount:
        (state.blackHole?.darkMatterAmount || 0) +
        mass * BLACK_HOLE_CONFIG.MASS_TO_DARK_MATTER_RATE,
      mass: 1,
      emittedEnergy: (state.blackHole?.emittedEnergy || 0) + mass * 1.79e12,
    },
  };
};

const hitCriticalMass = (state: GameState): GameState => {
  return {
    ...state,
    blackHole: {
      ...state.blackHole,
      energyRate: 0,
    },
  };
};

export const getUpgradeCost = (level: number, baseCost: number): number => {
  return Math.floor(baseCost * Math.pow(level, 1.5));
};

export const onBlackHoleUpgradePurchase = (
  state: GameState,
  upgradeId: string
): GameState => {
  const upgrade = blackHoleUpgrades.find((b) => b.id === upgradeId);
  if (!upgrade) return state;

  const currentLevel =
    state.blackHole?.upgrades?.find((u) => u.id === upgradeId)?.level ?? 0;
  if (currentLevel >= upgrade.maxLevel) return state;

  const cost = getUpgradeCost(currentLevel + 1, upgrade.baseCost);
  if ((state.blackHole?.darkMatterAmount ?? 0) < cost) return state;

  const newState = applyBlackHoleUpgrades(state, upgradeId, currentLevel + 1);

  const updatedUpgrades = [...(newState.blackHole?.upgrades || [])];
  const index = updatedUpgrades.findIndex((u) => u.id === upgradeId);
  if (index >= 0) {
    updatedUpgrades[index].level = currentLevel + 1;
  } else {
    updatedUpgrades.push({ id: upgradeId, level: 1 });
  }

  gameEvent("black_hole_upgrade", {
    id: upgradeId,
    newLevel: currentLevel + 1,
    cost,
  });

  return {
    ...newState,
    blackHole: {
      ...newState.blackHole,
      darkMatterAmount: newState.blackHole.darkMatterAmount - cost,
      upgrades: updatedUpgrades,
    },
  };
};

const applyBlackHoleUpgrades = (
  state: GameState,
  upgradeId: string,
  level: number
): GameState => {
  const newState = { ...state, blackHole: { ...state.blackHole } };

  switch (upgradeId) {
    case "mass_capacity":
      newState.blackHole.criticalMass =
        (newState.blackHole.criticalMass ||
          BLACK_HOLE_CONFIG.CRITICAL_MASS_LIMIT) + 1000;
      break;
    case "growth_rate":
      newState.blackHole.massGrowthRateBonus = level * 0.15;
      break;
    case "dark_matter_gen":
      newState.blackHole.darkMatterRateBonus = level * 0.05;
      break;
  }

  return newState;
};
