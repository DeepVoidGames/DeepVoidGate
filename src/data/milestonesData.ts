import { Milestone } from "@/store/types";

//TODO FIX REWARDS
export const initialMilestones: Milestone[] = [
  {
    id: "metal_tycoon_0",
    name: "Metal Magnate I",
    description: "Collect 10 000 metal",
    rewardDescription: "+1000 Metal Storage Capacity",
    category: "resources",
    progress: (state) => (state.resources.metals.amount / 10000) * 100,
    condition: (state) => state.resources.metals.amount >= 10000,
    reward: (state) => ({
      ...state,
      resources: {
        ...state.resources,
        metals: {
          ...state.resources.metals,
          capacity: state.resources.metals.capacity + 1000,
        },
      },
    }),
    completed: false,
  },
  {
    id: "metal_tycoon_1",
    name: "Metal Magnate II",
    description: "Collect 50 000 metal",
    rewardDescription: "+5000 Metal Storage Capacity",
    category: "resources",
    progress: (state) => (state.resources.metals.amount / 50000) * 100,
    condition: (state) => state.resources.metals.amount >= 50000,
    reward: (state) => ({
      ...state,
      resources: {
        ...state.resources,
        metals: {
          ...state.resources.metals,
          capacity: state.resources.metals.capacity + 5000,
        },
      },
    }),
    completed: false,
  },
  {
    id: "metal_tycoon_2",
    name: "Metal Magnate III",
    description: "Collect 100 000 metal",
    rewardDescription: "+10000 Metal Storage Capacity",
    category: "resources",
    progress: (state) => (state.resources.metals.amount / 100000) * 100,
    condition: (state) => state.resources.metals.amount >= 100000,
    reward: (state) => ({
      ...state,
      resources: {
        ...state.resources,
        metals: {
          ...state.resources.metals,
          capacity: state.resources.metals.capacity + 10000,
        },
      },
    }),
    completed: false,
  },
  {
    id: "metal_tycoon_3",
    name: "Metal Magnate IV",
    description: "Collect 1 000 000 metal",
    rewardDescription: "+50000 Metal Storage Capacity",
    category: "resources",
    progress: (state) => (state.resources.metals.amount / 1000000) * 100,
    condition: (state) => state.resources.metals.amount >= 1000000,
    reward: (state) => ({
      ...state,
      resources: {
        ...state.resources,
        metals: {
          ...state.resources.metals,
          capacity: state.resources.metals.capacity + 50000,
        },
      },
    }),
    completed: false,
  },
];
