import React, { useState, useEffect } from "react";
import { getGroupedAvailableLogs } from "@/store/reducers/logsReducer";
import { useGame } from "@/context/GameContext";
import {
  Search,
  BookOpen,
  Calendar,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

const LogsPanel: React.FC = () => {
  const { state } = useGame();
  const groupedLogs = getGroupedAvailableLogs(state);
  const categories = Object.keys(groupedLogs);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [LoadedLogComponent, setLoadedLogComponent] = useState<React.FC | null>(
    null
  );

  const allLogs = categories.flatMap((category) => groupedLogs[category]);
  const selectedLog = allLogs.find((log) => log.id === selectedLogId);

  useEffect(() => {
    const fetchLog = async () => {
      const log = allLogs.find((log) => log.id === selectedLogId);
      if (log) {
        const component = await log.file;
        setLoadedLogComponent(() => component);
      } else {
        setLoadedLogComponent(null);
      }
    };

    fetchLog();
  }, [selectedLogId, allLogs]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="glass-panel p-4 animate-fade-in space-y-4 max-w-7xl m-8 mt-24">
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT PANEL: Log list */}
        <div className="md:w-1/3 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Logs</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 bg-background/80 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {categories.map((category) => {
              const filteredLogs = groupedLogs[category].filter((log) =>
                log.id.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredLogs.length === 0) return null;

              return (
                <div key={category} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left font-semibold py-1 px-2 rounded-md bg-muted/20 hover:bg-muted/30 transition items-center flex gap-2"
                  >
                    {expandedCategories.includes(category) ? (
                      <ArrowDown className="w-4" />
                    ) : (
                      <ArrowRight className="w-4" />
                    )}{" "}
                    {category}
                  </button>

                  {expandedCategories.includes(category) && (
                    <div className="ml-4 space-y-2">
                      {filteredLogs.map((log) => (
                        <button
                          key={log.id}
                          onClick={() => setSelectedLogId(log.id)}
                          className={`w-full text-left p-2 rounded-md transition-colors border ${
                            selectedLogId === log.id
                              ? "bg-primary/60 text-white"
                              : "bg-background/40 hover:bg-primary/30"
                          }`}
                        >
                          <div className="font-medium">{log.id}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {categories.every((cat) =>
              groupedLogs[cat].every(
                (log) =>
                  !log.id.toLowerCase().includes(searchQuery.toLowerCase())
              )
            ) && (
              <p className="text-sm text-muted-foreground">No logs found.</p>
            )}
          </div>
        </div>

        <div className="md:w-2/3 bg-background/60 rounded-lg p-6 border overflow-y-auto max-h-[600px]">
          {selectedLog ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{selectedLog.id}</h3>
              <div className="prose dark:prose-invert">
                {LoadedLogComponent ? (
                  <LoadedLogComponent />
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a log to read its contents.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPanel;
