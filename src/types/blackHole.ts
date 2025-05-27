export type BlackHole = {
  formationTime?: number;
  lastUpdate?: number;
  mass?: number;
  criticalMass?: number; // Mass required to form a black hole
  darkMatterAmount?: number; // Time in seconds for the black hole to form
  energyRate?: number; // Energy generated per second based on mass
  schwarzschildRadius?: number; // Schwarzschild radius based on mass
  hawkingTemperature?: number; // Hawking temperature based on mass
  estimatedLifetime?: number; // Estimated lifetime in years based on mass
  totalEnergyProduced?: number; // Total energy produced since formation
  ageInSeconds?: number; // Age of the black hole in seconds
  massGrowthRate?: number; // Rate of mass increase per second
  currentGrowthMultiplier?: number; // Current growth multiplier based on conditions
  spin?: number; // Spin of the black hole (0-1)
  evaporationTime?: number; // Time until evaporation in seconds
  emittedEnergy?: number;
};
