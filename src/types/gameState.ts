import { ReactNode } from "react";
import { ResourceData, ResourceType } from "@/types/resource";
import { BuildingData } from "@/types/building";
import { Technology } from "@/types/technology";
import { Milestone } from "@/types/milestone";
import { Expedition } from "@/types/expedition";
import { Artifact } from "@/types/artifacts";
import { Faction, FactionEvent } from "@/types/factions";
import { Planet } from "@/types/colonization";
import { BlackHole } from "@/types/blackHole";

export interface GameState {
  version: string;
  name: ReactNode;
  resources: {
    [key in ResourceType]: ResourceData;
  };
  buildings: BuildingData[];
  population: {
    total: number;
    available: number;
    maxCapacity: number;
    deathTimer?: number;
  };
  technologies: Technology[];
  paused: boolean;
  lastUpdate: number;
  showOfflineProgress;
  offlineReport;
  colonistProgress: number;
  userID: string;
  milestones: Milestone[];
  expeditions: Expedition[];
  playtime: number;
  sessionLength: number;
  artifacts: Artifact[];
  factions: Faction[];
  factionEvent?: FactionEvent;
  nextFactionEventAt?: number;
  galacticKnowledge?: number;
  currentPlanet?: Planet;
  prestigeCount?: number;
  galacticUpgrades?: string[];
  blackHole?: BlackHole;
}
