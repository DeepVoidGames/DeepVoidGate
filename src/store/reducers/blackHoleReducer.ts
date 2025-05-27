import { GameState } from "@/types/gameState";

// Physical constants and configuration
const BLACK_HOLE_CONFIG = {
  // Basic growth parameters
  BASE_MASS_GROWTH_RATE: 0.001, // solar masses per second
  CRITICAL_MASS_LIMIT: 1000, // maximum mass in solar masses

  // Dark matter parameters
  DARK_MATTER_EFFICIENCY: 0.00001, // dark matter generated per unit mass
  DARK_MATTER_DECAY_RATE: 0.999, // dark matter decay (99.9% remains)

  // Energy parameters
  ENERGY_PER_SOLAR_MASS: 1000, // energy units per solar mass
  HAWKING_RADIATION_FACTOR: 0.0001, // energy loss through Hawking radiation

  // Black hole physics
  ACCRETION_EFFICIENCY: 0.1, // how efficiently it absorbs matter
  GROWTH_ACCELERATION: 1.1, // exponential growth (larger black holes grow faster)
};

export const blackHoleTick = (
  state: GameState,
  deltaTime: number
): GameState => {
  // Check if upgrade is unlocked
  if (!state?.galacticUpgrades?.includes("black_hole_unknow")) {
    return state;
  }

  // Avoid mutating original state
  const currentTime = Date.now();
  const blackHole = state.blackHole || {};

  // Initialize default values
  const currentMass = blackHole.mass || 1;
  const currentDarkMatter = blackHole.darkMatterAmount || 0;
  const formationTime = blackHole.formationTime || currentTime;

  // Exponential growth - larger black holes grow faster
  const growthMultiplier = Math.pow(currentMass / 10, 0.3); // gentle exponential growth
  const massGrowthRate =
    BLACK_HOLE_CONFIG.BASE_MASS_GROWTH_RATE *
    (1 + growthMultiplier) *
    BLACK_HOLE_CONFIG.ACCRETION_EFFICIENCY;

  // Calculate new mass with limit
  const newMass = Math.min(
    currentMass + massGrowthRate * deltaTime,
    BLACK_HOLE_CONFIG.CRITICAL_MASS_LIMIT
  );

  // Dark matter generated proportionally to mass increase
  const massIncrease = newMass - currentMass;
  const darkMatterGenerated =
    massIncrease * BLACK_HOLE_CONFIG.DARK_MATTER_EFFICIENCY * deltaTime;

  // Dark matter decay over time
  const darkMatterDecay =
    currentDarkMatter *
    (1 - BLACK_HOLE_CONFIG.DARK_MATTER_DECAY_RATE) *
    deltaTime;

  const newDarkMatter = Math.max(
    0,
    currentDarkMatter + darkMatterGenerated - darkMatterDecay
  );

  // Energy from matter accretion
  const accretionEnergy = newMass * BLACK_HOLE_CONFIG.ENERGY_PER_SOLAR_MASS;

  // Energy loss through Hawking radiation (inversely proportional to mass)
  const hawkingLoss =
    (BLACK_HOLE_CONFIG.HAWKING_RADIATION_FACTOR / newMass) * deltaTime;

  const netEnergyRate = Math.max(0, accretionEnergy - hawkingLoss);

  // Schwarzschild radius (in km)
  const schwarzschildRadius = newMass * 2.95; // km for mass in solar masses

  // Hawking temperature (in Kelvin)
  const hawkingTemperature = 6.17e-8 / newMass; // K

  // Black hole lifetime (in years)
  const lifetimeYears = Math.pow(newMass, 3) * 6.6e-5; // very simplified formula

  return {
    ...state,
    blackHole: {
      // Basic properties
      formationTime: formationTime, // preserve original formation time
      lastUpdate: currentTime,
      mass: newMass,
      criticalMass: BLACK_HOLE_CONFIG.CRITICAL_MASS_LIMIT,

      // Resources
      darkMatterAmount: newDarkMatter,
      energyRate: netEnergyRate,

      // Physical properties
      schwarzschildRadius: schwarzschildRadius,
      hawkingTemperature: hawkingTemperature,
      estimatedLifetime: lifetimeYears,

      // Statistics
      totalEnergyProduced:
        (blackHole.totalEnergyProduced || 0) + netEnergyRate * deltaTime,
      ageInSeconds: (currentTime - formationTime) / 1000,

      // Growth indicators
      massGrowthRate: massGrowthRate,
      currentGrowthMultiplier: growthMultiplier,
    },
    resources: {
      ...state.resources,
      energy: {
        ...state.resources.energy,
        amount: Math.min(
          (state.resources.energy?.amount || 0) + netEnergyRate * deltaTime,
          state.resources.energy.capacity || 0
        ),
      },
    },
  };
};
