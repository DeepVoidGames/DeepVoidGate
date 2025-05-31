import { ExpeditionType, ResourceAmount } from "@/types/expedition";
import { FactionName } from "@/types/factions";

export const GA_TRACKING_ID = "G-D4HNW2XMK3";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!window.gtag) return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = (action: string, params: Record<string, any>) => {
  if (!window.gtag) return;
  window.gtag("event", action, params);
};

type GameEvent =
  | {
      action: "build_started";
      params: { type: string; name: string; tier: number; cost: any };
    }
  | {
      action: "build_upgraded";
      params: {
        type: string;
        name: string;
        fromTier: number;
        fromUpgrades: number;
        toTier: number;
        toUpgrades: number;
        cost: any;
      };
    }
  | {
      action: "build_mass_upgraded";
      params: {
        type: string;
        name: string;
        fromTier: number;
        fromUpgrades: number;
        toTier: number;
        toUpgrades: number;
        upgradesApplied: number;
        cost: string;
      };
    }
  | {
      action: "artifact_upgraded";
      params: {
        name: string;
        fromStars: number;
        toStars: number;
        copiesUsed: number;
      };
    }
  | {
      action: "artifact_copies_added";
      params: {
        name: string;
        amount: number;
        newTotal: number;
      };
    }
  | {
      action: "black_hole_upgrade";
      params: {
        id: string;
        newLevel: number;
        cost: number;
      };
    }
  | {
      action: "colonized_planet";
      params: {
        planetName: string;
        prestigeCount: number;
        newKnowledge: number;
      };
    }
  | {
      action: "galactic_upgrade_purchased";
      params: {
        id: string;
        cost: number;
      };
    }
  | {
      action: "expedition_started";
      params: {
        type: ExpeditionType;
        tier: number;
        crew: number;
        duration: number;
      };
    }
  | {
      action: "expedition_event_choice";
      params: {
        expeditionId: string;
        eventId: string;
        optionIndex: number;
      };
    }
  | {
      action: "expedition_reward_collected";
      params: {
        expeditionId: string;
        type: ExpeditionType;
        tier: number;
        rewards: ResourceAmount;
        artifact?: string;
        unlockedTechnologies?: string;
        affectedFactions?: string;
      };
    }
  | {
      action: "faction_loyalty_updated";
      params: {
        factionId: FactionName;
        amount: number;
        adjustedAmount: number;
        newLoyalty: number;
        artifactUsed: boolean;
      };
    }
  | {
      action: "technology_research_started";
      params: {
        techId: string;
        techName: string;
        researchDuration: number;
        factionId?: FactionName;
        factionLoyalty?: number;
      };
    }
  | {
      action: "milestone_unlocked";
      params: {
        milestoneId: string;
        milestoneName: string;
        tier?: number;
      };
    }
  | {
      action: "milestone_revoked";
      params: {
        milestoneId: string;
        milestoneName: string;
        tier?: number;
      };
    };

export const gameEvent = <T extends GameEvent["action"]>(
  action: T,
  params: Extract<GameEvent, { action: T }>["params"]
) => {
  if (!window.gtag) return;
  window.gtag("event", action, params);
};
