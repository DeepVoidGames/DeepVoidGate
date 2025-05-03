import { BuildingCategory, BuildingType } from "@/store/types";
import {
  Home,
  Droplets,
  Leaf,
  Zap,
  Pickaxe,
  FlaskConical,
  Users,
  Clock,
  Factory,
  Microscope,
  Building,
  Search,
  Package,
  Warehouse,
} from "lucide-react";
import React from "react";

export const buildingConfig = [
  {
    type: "oxygenGenerator" as BuildingType,
    name: "Oxygen Generator",
    category: "production" as BuildingCategory,
    icon: React.createElement(Droplets, { className: "h-5 w-5 text-cyan-400" }),
  },
  {
    type: "hydroponicFarm" as BuildingType,
    name: "Hydroponic Farm",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "solarPanel" as BuildingType,
    name: "Solar Panel",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "metalMine" as BuildingType,
    name: "Metal Mine",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "researchLab" as BuildingType,
    name: "Research Lab",
    category: "research" as BuildingCategory,
    icon: React.createElement(FlaskConical, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "housing" as BuildingType,
    name: "Basic House",
    category: "housing" as BuildingCategory,
    icon: React.createElement(Home, { className: "h-5 w-5 text-blue-400" }),
  },
  {
    type: "basicStorage" as BuildingType,
    name: "Basic Storage",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Package, {
      className: "h-5 w-5 text-orange-400",
    }),
  },
  {
    type: "advancedStorage" as BuildingType,
    name: "Advanced Storage",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Warehouse, {
      className: "h-5 w-5 text-blue-400",
    }),
  },
  {
    type: "basicBattery" as BuildingType,
    name: "Basic Battery",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "advancedMetalExtractor" as BuildingType,
    name: "Advanced Metal Extractor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "highYieldMetalFracturer" as BuildingType,
    name: "High-Yield Metal Fracturer",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "plasmaCoreMetalSynthesizer" as BuildingType,
    name: "Plasma Core Metal Synthesizer",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "geothermalPlant" as BuildingType,
    name: "Geothermal Plant",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "fissionReactor" as BuildingType,
    name: "Fission Reactor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "fusionReactor" as BuildingType,
    name: "Fusion Reactor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "algaeOxygenFarm" as BuildingType,
    name: "Algae Oxygen Farm",
    category: "production" as BuildingCategory,
    icon: React.createElement(Droplets, { className: "h-5 w-5 text-cyan-400" }),
  },
  {
    type: "electrolyticOxygenPlant" as BuildingType,
    name: "Electrolytic Oxygen Plant",
    category: "production" as BuildingCategory,
    icon: React.createElement(Droplets, { className: "h-5 w-5 text-cyan-400" }),
  },
  {
    type: "plasmaOxygenRefinery" as BuildingType,
    name: "Plasma Oxygen Refinery",
    category: "production" as BuildingCategory,
    icon: React.createElement(Droplets, { className: "h-5 w-5 text-cyan-400" }),
  },
  {
    type: "fungalFarm" as BuildingType,
    name: "Fungal Farm",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "hydroponicTower" as BuildingType,
    name: "Hydroponic Tower",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "proteinSynthesizer" as BuildingType,
    name: "Protein Synthesizer",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "dataAnalysisCenter" as BuildingType,
    name: "Data Analysis Center",
    category: "research" as BuildingCategory,
    icon: React.createElement(FlaskConical, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "quantumComputer" as BuildingType,
    name: "Quantum Computer",
    category: "research" as BuildingCategory,
    icon: React.createElement(FlaskConical, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "neuralSimulationLab" as BuildingType,
    name: "Neural SimulationLab",
    category: "research" as BuildingCategory,
    icon: React.createElement(FlaskConical, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "modularStorageHub" as BuildingType,
    name: "Modular Storage Hub",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Warehouse, {
      className: "h-5 w-5 text-blue-400",
    }),
  },
  {
    type: "metallicCompactionVault" as BuildingType,
    name: "Metallic Compaction Vault",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Warehouse, {
      className: "h-5 w-5 text-blue-400",
    }),
  },
  {
    type: "cryoUniversalDepot" as BuildingType,
    name: "Cryo-Universal Depot",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Warehouse, {
      className: "h-5 w-5 text-blue-400",
    }),
  },
  {
    type: "quantumFluxMetalForge" as BuildingType,
    name: "Quantum-Flux Metal Forge",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "fusionEdgeMetallizer" as BuildingType,
    name: "Fusion-Edge Metallizer",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "nanoDismantlerFoundry" as BuildingType,
    name: "Nano-Dismantler Foundry",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "subterranean_arcology" as BuildingType,
    name: "Subterranean Arcology",
    category: "housing" as BuildingCategory,
    icon: React.createElement(Home, { className: "h-5 w-5 text-blue-400" }),
  },
  {
    type: "myco_grow_chamber" as BuildingType,
    name: "Myco Grow Chamber",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "exoforge_foundry" as BuildingType,
    name: "Exoforge Foundry",
    category: "production" as BuildingCategory,
    icon: React.createElement(Factory, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "quantum_alloy_energy_core" as BuildingType,
    name: "Quantum Alloy Energy Core",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "xeno_carbon_agro_complex" as BuildingType,
    name: "Xeno-Carbon Agro Complex",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "qmet_biofarm" as BuildingType,
    name: "Quantum Biofarm",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "qmet_oxyplant" as BuildingType,
    name: "Oxy-Fusion Plant",
    category: "production" as BuildingCategory,
    icon: React.createElement(Droplets, { className: "h-5 w-5 text-cyan-400" }),
  },
  {
    type: "harmonic_core_generator" as BuildingType,
    name: "Harmonic Core Generator",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "resonant_fabricator" as BuildingType,
    name: "Resonant Fabricator",
    category: "production" as BuildingCategory,
    icon: React.createElement(Factory, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "symbio_colony_hub" as BuildingType,
    name: "Symbio Colony Hub",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-blue-400" }),
  },
  {
    type: "symbio_resource_loop" as BuildingType,
    name: "Symbio Resource Loop",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, {
      className: "h-5 w-5 text-indigo-400",
    }),
  },
  {
    type: "chrono_turbine" as BuildingType,
    name: "Chrono Turbine",
    category: "production" as BuildingCategory,
    icon: React.createElement(Clock, { className: "h-5 w-5 text-violet-400" }),
  },
  {
    type: "floating_habitat" as BuildingType,
    name: "Floating Habitat",
    category: "housing" as BuildingCategory,
    icon: React.createElement(Home, { className: "h-5 w-5 text-blue-400" }),
  },
  {
    type: "bio_caverns" as BuildingType,
    name: "Symbiotic Bio-Caverns",
    category: "housing" as BuildingCategory,
    icon: React.createElement(Home, { className: "h-5 w-5 text-blue-400" }),
  },
  {
    type: "dimensional_refinery" as BuildingType,
    name: "Dimensional Refinery",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "void_storage_core" as BuildingType,
    name: "Void Storage Core",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Package, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "smart_resource_matrix" as BuildingType,
    name: "Smart Resource Matrix",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Package, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "nutrient_reserve_cluster" as BuildingType,
    name: "Nutrient Reserve Cluster",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Package, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "aeropulse_vault" as BuildingType,
    name: "Aeropulse Vault",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Package, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "quantumCapacitor" as BuildingType,
    name: "Quantum Capacitor",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Zap, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "antimatterCell" as BuildingType,
    name: "Antimatter Cell",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Zap, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "voidCore" as BuildingType,
    name: "Void Singularity Core",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Zap, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "morpho_core" as BuildingType,
    name: "Morpho-Core",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "nutri_flux_hub" as BuildingType,
    name: "Nutri-Flux Hub",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "aeroponicFarm" as BuildingType,
    name: "Aeroponic Farm",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, {
      className: "h-5 w-5 text-green-400",
    }),
  },
  {
    type: "advancedSolarPanel" as BuildingType,
    name: "Advanced Solar Array",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, {
      className: "h-5 w-5 text-yellow-400",
    }),
  },
  {
    type: "deepMetalMine" as BuildingType,
    name: "Deep Metal Extractor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, {
      className: "h-5 w-5 text-gray-400",
    }),
  },
  {
    type: "chrono_forge" as BuildingType,
    name: "Chrono-Forge",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, {
      className: "h-5 w-5 text-red-400",
    }),
  },
  {
    type: "biosurge_chamber" as BuildingType,
    name: "Biosurge Chamber",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, {
      className: "h-5 w-5 text-red-400",
    }),
  },
  {
    type: "quantum_forge_array" as BuildingType,
    name: "Quantum Forge Array",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, {
      className: "h-5 w-5 text-red-400",
    }),
  },
  {
    type: "bio_reconstruction_vat" as BuildingType,
    name: "Bio-Reconstruction Vat",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, {
      className: "h-5 w-5 text-red-400",
    }),
  },
  {
    type: "astral_scriptorium" as BuildingType,
    name: "Astral Scriptorium",
    category: "research" as BuildingCategory,
    icon: React.createElement(FlaskConical, {
      className: "h-5 w-5 text-red-400",
    }),
  },
  {
    type: "genetic_ecosynth_laboratory" as BuildingType,
    name: "Genetic Ecosynth Laboratory",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, {
      className: "h-5 w-5 text-red-400",
    }),
  },
  {
    type: "sentient_growth_core" as BuildingType,
    name: "Sentient Growth Core",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, {
      className: "h-5 w-5 text-red-400",
    }),
  },
];
