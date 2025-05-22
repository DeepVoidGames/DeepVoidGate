import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  LineChart,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ChartArea,
} from "lucide-react";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { useGame } from "@/context/GameContext";
import { useAnalytics } from "@/context/AnalyticsContext";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

type OnlineSnapshot = {
  timestamp: string; // Zakładamy, że timestamp jest wystarczająco unikalny
  count: number;
};

type OnlineStats = {
  max: number;
  min: number;
  avg: number;
  current: number;
};

type HistoryData = {
  data_points: OnlineSnapshot[];
  stats: OnlineStats;
};

const ranges = ["last_hour", "last_24h", "last_7d", "last_30d"] as const;
type Range = (typeof ranges)[number];

const rangeLabels: Record<Range, string> = {
  last_hour: "Last Hour",
  last_24h: "24 Hours",
  last_7d: "7 Days",
  last_30d: "30 Days",
};

const OnlinePlayersPanel: React.FC = () => {
  const { state: gameState } = useGame();
  const { onlineStats: currentOnlineFromContext } = useAnalytics();

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Record<Range, HistoryData>>({
    last_hour: {
      data_points: [],
      stats: { max: 0, min: 0, avg: 0, current: 0 },
    },
    last_24h: {
      data_points: [],
      stats: { max: 0, min: 0, avg: 0, current: 0 },
    },
    last_7d: { data_points: [], stats: { max: 0, min: 0, avg: 0, current: 0 } },
    last_30d: {
      data_points: [],
      stats: { max: 0, min: 0, avg: 0, current: 0 },
    },
  });
  const [activeTab, setActiveTab] = useState<Range>("last_24h");
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");

  const fetchHistoryData = useCallback(async () => {
    try {
      setLoading(true);

      const historyResponse = await fetch(
        "https://api.fern.fun/deepvoidgate/online/history/summary?detailed=true"
      );

      if (!historyResponse.ok) {
        throw new Error(`HTTP error! status: ${historyResponse.status}`);
      }

      const historyData = await historyResponse.json();

      const currentOnlineCount = currentOnlineFromContext?.online_count || 0;

      const validatedHistory = {
        last_hour: historyData.last_hour || {
          data_points: [],
          stats: {
            max: 0,
            min: 0,
            avg: 0,
            current: currentOnlineCount,
          },
        },
        last_24h: historyData.last_24h || {
          data_points: [],
          stats: {
            max: 0,
            min: 0,
            avg: 0,
            current: currentOnlineCount,
          },
        },
        last_7d: historyData.last_7d || {
          data_points: [],
          stats: {
            max: 0,
            min: 0,
            avg: 0,
            current: currentOnlineCount,
          },
        },
        last_30d: historyData.last_30d || {
          data_points: [],
          stats: {
            max: 0,
            min: 0,
            avg: 0,
            current: currentOnlineCount,
          },
        },
      };

      setHistory(validatedHistory);
    } catch (err) {
      console.error("Failed to fetch online history data", err);
      setHistory({
        last_hour: {
          data_points: [],
          stats: { max: 0, min: 0, avg: 0, current: 0 },
        },
        last_24h: {
          data_points: [],
          stats: { max: 0, min: 0, avg: 0, current: 0 },
        },
        last_7d: {
          data_points: [],
          stats: { max: 0, min: 0, avg: 0, current: 0 },
        },
        last_30d: {
          data_points: [],
          stats: { max: 0, min: 0, avg: 0, current: 0 },
        },
      });
    } finally {
      setLoading(false);
    }
  }, [currentOnlineFromContext?.online_count]);

  useEffect(() => {
    fetchHistoryData();

    const interval = setInterval(() => {
      fetchHistoryData();
    }, 5 * 60 * 1000); // 5 minut

    return () => clearInterval(interval);
  }, [fetchHistoryData]);

  const formatChartData = (data: OnlineSnapshot[] | undefined) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((point) => ({
      // Usunięto index, jeśli timestamp jest unikalny
      timestamp: point.timestamp,
      count: point.count,
      formattedTime: formatTimeForRange(point.timestamp, activeTab),
    }));
  };

  const formatTimeForRange = (timestamp: string, range: Range) => {
    const date = new Date(timestamp);
    switch (range) {
      case "last_hour":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "last_24h":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "last_7d":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
        });
      case "last_30d":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      default:
        return date.toLocaleString();
    }
  };

  const currentData = history[activeTab];
  const chartData = formatChartData(currentData?.data_points);
  const stats = currentData?.stats || { max: 0, min: 0, avg: 0, current: 0 };

  const getTrend = () => {
    if (chartData.length < 2) return { direction: "stable", percentage: 0 };

    const recent =
      chartData.slice(-5).reduce((sum, point) => sum + point.count, 0) /
      Math.min(5, chartData.length);
    const older =
      chartData.slice(0, 5).reduce((sum, point) => sum + point.count, 0) /
      Math.min(5, chartData.length);

    if (older === 0) {
      return {
        direction: recent > 0 ? "up" : "stable",
        percentage: recent > 0 ? 100 : 0,
      };
    }

    if (recent > older * 1.1)
      return { direction: "up", percentage: ((recent - older) / older) * 100 };
    if (recent < older * 0.9)
      return {
        direction: "down",
        percentage: ((older - recent) / older) * 100,
      };
    return { direction: "stable", percentage: 0 };
  };

  const trend = getTrend();

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available for this period</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-background/95 border border-muted/50 rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium">{`Players: ${payload[0].value}`}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        );
      }
      return null;
    };

    switch (chartType) {
      case "line":
        return (
          <RechartsLineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted))"
              opacity={0.3}
            />
            <XAxis
              dataKey="formattedTime"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
              activeDot={{
                r: 5,
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
              }}
            />
          </RechartsLineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted))"
              opacity={0.3}
            />
            <XAxis
              dataKey="formattedTime"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorPlayers)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted))"
              opacity={0.3}
            />
            <XAxis
              dataKey="formattedTime"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              opacity={0.8}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  const currentOnlineDisplay =
    currentOnlineFromContext?.online_count !== undefined
      ? currentOnlineFromContext.online_count
      : "...";

  if (loading) {
    return (
      <div
        className={`glass-panel p-6 space-y-6 animate-fade-in ${getDominantFactionTheme(
          gameState,
          { styleType: "border", opacity: 0.8 }
        )}`}
      >
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-muted/30 rounded w-48"></div>
          <div className="h-24 bg-muted/30 rounded"></div>
          <div className="h-64 bg-muted/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel p-6 space-y-6 animate-fade-in ${getDominantFactionTheme(
        gameState,
        { styleType: "border", opacity: 0.8 }
      )}`}
    >
      <h2 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Online Players Analytics
      </h2>

      {/* Current Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-background/60 border border-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-xs mb-1">
                  Current
                </div>
                <div className="text-2xl font-bold text-foreground/90">
                  {currentOnlineDisplay}
                </div>
              </div>
              <Users className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 border border-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Peak</div>
                <div className="text-xl font-bold text-green-400">
                  {stats.max}
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 border border-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-xs mb-1">
                  Average
                </div>
                <div className="text-xl font-bold text-blue-400">
                  {Math.round(stats.avg)}
                </div>
              </div>
              <Minus className="w-6 h-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 border border-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Trend</div>
                <div
                  className={`text-xl font-bold ${
                    trend.direction === "up"
                      ? "text-green-400"
                      : trend.direction === "down"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {trend.direction === "stable"
                    ? "Stable"
                    : `${Math.round(trend.percentage)}%`}
                </div>
              </div>
              {trend.direction === "up" && (
                <TrendingUp className="w-6 h-6 text-green-400" />
              )}
              {trend.direction === "down" && (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
              {trend.direction === "stable" && (
                <Minus className="w-6 h-6 text-yellow-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-background/60 border border-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-foreground/90 flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Activity Chart
            </h3>

            <div className="flex items-center gap-2">
              {/* Chart Type Selector */}
              <div className="flex bg-background/40 rounded-lg p-1">
                {[
                  { type: "area" as const, icon: ChartArea },
                  { type: "line" as const, icon: LineChart },
                  { type: "bar" as const, icon: BarChart3 },
                ].map(({ type, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`p-2 rounded transition-colors ${
                      chartType === type
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Time Range Selector */}
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as Range)}
              >
                <TabsList className="bg-background/40">
                  {ranges.map((range) => (
                    <TabsTrigger key={range} value={range} className="text-xs">
                      {rangeLabels[range]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          {/* Data Summary */}
          {chartData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-muted/30">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Showing {chartData.length} data points over{" "}
                  {rangeLabels[activeTab].toLowerCase()}
                </p>
                <p>
                  Last updated historical data:{" "}
                  {new Date().toLocaleTimeString()}
                </p>
                {currentData?.data_points?.length === 0 && (
                  <p className="text-amber-400">
                    No historical data available for this time range
                  </p>
                )}
              </div>
            </div>
          )}

          {/* No data message */}
          {chartData.length === 0 && !loading && (
            <div className="mt-4 pt-4 border-t border-muted/30">
              <div className="text-xs text-muted-foreground">
                <p>No data available for the selected time range</p>
                <p>
                  This could be because the analytics system is new or data
                  collection is in progress
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(OnlinePlayersPanel);
