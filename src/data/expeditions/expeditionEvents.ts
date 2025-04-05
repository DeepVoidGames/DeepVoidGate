import { ResourceType } from "@/store/types";

export type EventOutcomeType =
  | "success"
  | "partial_success"
  | "failure"
  | "critical_failure"
  | "critical_success";

export interface EventChoice {
  id: string;
  text: string;
  requiresSkill?: {
    skill: string;
    level: number;
  };
  requiresEquipment?: {
    itemId: string;
    consumed?: boolean;
  };
  requiresResource?: Partial<Record<ResourceType, number>>;
  requiresPersonnel?: number;
  outcomeChances: {
    [key in EventOutcomeType]?: number; // Probability of this outcome (0-100)
  };
}

export interface EventOutcome {
  type: EventOutcomeType;
  description: string;
  effects: {
    resources?: Partial<Record<ResourceType, number>>;
    personnel?: number; // Negative for losses
    equipment?: {
      gain?: { [key: string]: number };
      loss?: { [key: string]: number };
    };
    expedition?: {
      timeModifier?: number; // Percentage (e.g., -20 means expedition is 20% shorter)
      successChanceModifier?: number; // Percentage points (e.g., -10 means success chance is 10pp lower)
    };
    unlockEvent?: string; // ID of an event that becomes available after this outcome
  };
}

export interface ExpeditionEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  applicationConditions?: {
    expeditionTypes?: string[];
    missionTypes?: string[];
    requiredTechnology?: string[];
    minDuration?: number;
    personnelCount?: { min?: number; max?: number };
    resourcesRequired?: Partial<Record<ResourceType, number>>;
    chance?: number; // Percentage chance this event occurs when eligible
  };
  choices: EventChoice[];
  outcomes: Record<string, EventOutcome>; // Map of choiceId_outcomeType to outcome
}

export const expeditionEvents: ExpeditionEvent[] = [
  {
    id: "resource_vein",
    title: "Rich Resource Vein",
    description:
      "Your team has discovered what appears to be a rich vein of valuable minerals. Initial scans show high concentrations, but accessing it might require additional effort.",
    image: "/images/events/resource_vein.jpg",
    applicationConditions: {
      missionTypes: ["resource"],
      chance: 40,
    },
    choices: [
      {
        id: "extract_carefully",
        text: "Extract carefully with current equipment",
        outcomeChances: {
          success: 60,
          partial_success: 30,
          failure: 10,
        },
      },
      {
        id: "use_explosives",
        text: "Use explosives for faster extraction",
        requiresResource: { energy: 50 },
        outcomeChances: {
          critical_success: 20,
          success: 40,
          failure: 30,
          critical_failure: 10,
        },
      },
      {
        id: "call_specialists",
        text: "Call for specialist equipment",
        requiresResource: { energy: 100 },
        outcomeChances: {
          success: 80,
          partial_success: 20,
        },
      },
    ],
    outcomes: {
      extract_carefully_success: {
        type: "success",
        description:
          "Your team carefully extracts the resources using current equipment. The operation is successful and yields valuable minerals.",
        effects: {
          resources: { metals: 100 },
        },
      },
      extract_carefully_partial_success: {
        type: "partial_success",
        description:
          "The team manages to extract some resources, but much of the vein remains inaccessible with your current equipment.",
        effects: {
          resources: { metals: 40 },
        },
      },
      extract_carefully_failure: {
        type: "failure",
        description:
          "Despite careful work, the vein proves unstable and collapses before any significant resources can be extracted.",
        effects: {
          resources: { metals: 10 },
        },
      },
      use_explosives_critical_success: {
        type: "critical_success",
        description:
          "The explosives are perfectly placed! The blast reveals an even larger deposit than expected, and your team quickly extracts a massive amount of resources.",
        effects: {
          resources: { metals: 250 },
        },
      },
      use_explosives_success: {
        type: "success",
        description:
          "The explosives work as intended, breaking apart the rock and allowing your team to access the resource vein efficiently.",
        effects: {
          resources: { metals: 150 },
        },
      },
      use_explosives_failure: {
        type: "failure",
        description:
          "The explosives cause more damage than expected, collapsing part of the vein and making it difficult to extract resources.",
        effects: {
          resources: { metals: 30 },
          expedition: {
            timeModifier: 10, // Expedition takes 10% longer
          },
        },
      },
      use_explosives_critical_failure: {
        type: "critical_failure",
        description:
          "The explosives trigger a catastrophic collapse! Your team barely escapes, and one member is injured in the process.",
        effects: {
          personnel: -1,
          expedition: {
            timeModifier: 20, // Expedition takes 20% longer
            successChanceModifier: -10, // Success chance reduced by 10 percentage points
          },
        },
      },
      call_specialists_success: {
        type: "success",
        description:
          "The specialist equipment arrives and your team efficiently extracts a substantial amount of resources.",
        effects: {
          resources: { metals: 200 },
        },
      },
      call_specialists_partial_success: {
        type: "partial_success",
        description:
          "The specialist equipment helps, but there are some technical difficulties that slow down the extraction process.",
        effects: {
          resources: { metals: 120 },
          expedition: {
            timeModifier: 5, // Expedition takes 5% longer
          },
        },
      },
    },
  },
  {
    id: "strange_readings",
    title: "Anomalous Energy Readings",
    description:
      "Your scientific instruments detect unusual energy patterns emanating from a nearby rock formation. The readings don't match anything in your database.",
    image: "/images/events/strange_readings.jpg",
    applicationConditions: {
      missionTypes: ["research"],
      chance: 50,
    },
    choices: [
      {
        id: "observe_distance",
        text: "Observe from a safe distance",
        outcomeChances: {
          success: 90,
          partial_success: 10,
        },
      },
      {
        id: "close_investigation",
        text: "Investigate up close",
        requiresSkill: {
          skill: "science",
          level: 2,
        },
        outcomeChances: {
          critical_success: 20,
          success: 50,
          failure: 20,
          critical_failure: 10,
        },
      },
      {
        id: "collect_samples",
        text: "Collect samples for analysis",
        requiresEquipment: {
          itemId: "sample_collection_kit",
          consumed: true,
        },
        outcomeChances: {
          critical_success: 30,
          success: 60,
          failure: 10,
        },
      },
    ],
    outcomes: {
      observe_distance_success: {
        type: "success",
        description:
          "Your team records valuable data about the energy patterns without risk. The findings will help advance your research.",
        effects: {
          resources: { science: 100 },
        },
      },
      observe_distance_partial_success: {
        type: "partial_success",
        description:
          "You gather some data, but the distance limits what you can learn about the phenomenon.",
        effects: {
          resources: { science: 40 },
        },
      },
      close_investigation_critical_success: {
        type: "critical_success",
        description:
          "Your close investigation reveals an incredible discovery! You've found an entirely new form of energy that could revolutionize your technology.",
        effects: {
          resources: { science: 300, energy: 150 },
          unlockEvent: "energy_breakthrough",
        },
      },
      close_investigation_success: {
        type: "success",
        description:
          "Your team carefully studies the anomaly up close, gathering valuable data about its properties and potential applications.",
        effects: {
          resources: { science: 150 },
        },
      },
      close_investigation_failure: {
        type: "failure",
        description:
          "As your team approaches, the energy pattern becomes unstable. You retreat to safety but collect only minimal data.",
        effects: {
          resources: { science: 30 },
        },
      },
      close_investigation_critical_failure: {
        type: "critical_failure",
        description:
          "The energy pattern suddenly discharges! One team member is injured, and some of your equipment is damaged.",
        effects: {
          personnel: -1,
          resources: { science: 10, energy: -50 },
        },
      },
      collect_samples_critical_success: {
        type: "critical_success",
        description:
          "The samples you collect contain a previously unknown element with extraordinary properties! This will significantly advance your scientific understanding.",
        effects: {
          resources: { science: 250 },
          unlockEvent: "new_element",
        },
      },
      collect_samples_success: {
        type: "success",
        description:
          "Your team successfully collects several samples that will provide valuable research data.",
        effects: {
          resources: { science: 180 },
        },
      },
      collect_samples_failure: {
        type: "failure",
        description:
          "The samples degrade rapidly after collection, leaving you with minimal useful data.",
        effects: {
          resources: { science: 40 },
        },
      },
    },
  },
  // Add more events as needed
];
