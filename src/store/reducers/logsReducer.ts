import { GameState } from "@/types/gameState";

export interface LogEntry {
  id: string;
  file: Promise<() => JSX.Element>;
  timestamp: number;
  available: (state: GameState) => boolean;
  category: string;
}

const logs: LogEntry[] = [
  {
    id: "LOG-A1",
    category: "LSFE Commander",
    file: import("@/data/LoreLogs/LSFE-COMMANDER/Logfile1").then(
      (module) => module.LogFile1
    ),
    timestamp: Date.parse("2167-11-04"),
    available: () => true,
  },
  {
    id: "LOG-A2",
    category: "LSFE Commander",
    file: import("@/data/LoreLogs/LSFE-COMMANDER/Logfile2").then(
      (module) => module.LogFile2
    ),
    timestamp: Date.parse("2167-11-05"),
    available: () => true,
  },
];

export const getGroupedAvailableLogs = (state: GameState) => {
  const available = logs.filter((log) => log.available(state));

  const grouped: Record<string, LogEntry[]> = {};
  for (const log of available) {
    if (!grouped[log.category]) grouped[log.category] = [];
    grouped[log.category].push(log);
  }

  return grouped;
};
