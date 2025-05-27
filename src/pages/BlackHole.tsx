import React, { useState } from "react";
import {
  Zap,
  AlertTriangle,
  Activity,
  Clock,
  Atom,
  Gauge,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";
import { IMAGE_PATH } from "@/config";
import { useGame } from "@/context/GameContext";

const BlackHole = () => {
  const { state } = useGame();
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  // Get black hole data from state (calculated in blackHoleTick)
  const blackHole = state?.blackHole;

  const convertMassToDarkMatter = () => {
    console.log("Converting mass to dark matter...");
    // dispatch({ type: "CONVERT_MASS_TO_DARK_MATTER" });
  };

  const stabilizeBlackHole = () => {
    console.log("Stabilizing black hole...");
    // dispatch({ type: "STABILIZE_BLACK_HOLE" });
  };

  // Calculate threat level from existing data
  const getThreatLevel = () => {
    if (!blackHole) return 0;
    const mass = blackHole.mass || 0;
    const criticalMass = blackHole.criticalMass || 1000;
    return Math.min((mass / criticalMass) * 100, 100);
  };

  const threatLevel = getThreatLevel();

  const getThreatColor = () => {
    if (threatLevel < 30) return "text-green-400";
    if (threatLevel < 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getThreatBorderColor = () => {
    if (threatLevel < 30) return "border-green-800";
    if (threatLevel < 70) return "border-yellow-800";
    return "border-red-800";
  };

  // Format age for display
  const formatAge = (ageInSeconds: number) => {
    return (ageInSeconds / 60).toFixed(2);
  };

  // Don't render if black hole doesn't exist
  if (!blackHole) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-background/90 rounded-lg shadow-lg">
        <div className="glass-panel p-6 space-y-6 animate-fade-in border-purple-800/30 mt-20">
          <p className="text-center text-muted-foreground">
            Black hole not yet formed. Unlock the black hole upgrade first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background/90 rounded-lg shadow-lg">
      <div className="glass-panel p-6 space-y-6 animate-fade-in border-purple-800/30 mt-20">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground/90 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-black rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-full border-2 border-purple-400"></div>
            </div>
            Sagittarius A*-2
          </h2>

          <button
            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg  transition-colors"
          >
            {showAdvancedStats ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {showAdvancedStats ? "Basic" : "Advanced"}
            </span>
          </button>
        </div>

        {/* Black Hole Visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-64 h-64">
              <img
                src={`${IMAGE_PATH}blackHole.gif`}
                alt="Black Hole"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            {/* Age display */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center m-2">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-bold text-purple-400">
                {formatAge(blackHole.ageInSeconds || 0)} Million Years
              </p>
            </div>
          </div>
        </div>

        {/* Threat Level */}
        <div
          className={`p-4 rounded-lg border-2 ${getThreatBorderColor()} bg-background/30`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-foreground/90 flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${getThreatColor()}`} />
              Planetary Threat Level
            </h3>
            <span className={`font-bold ${getThreatColor()}`}>
              {threatLevel.toFixed(1)}%
            </span>
          </div>
          <Progress value={threatLevel} className="h-3 mb-2" />
          <p className="text-xs text-muted-foreground">
            {threatLevel < 30
              ? "Safe - Black hole is stable"
              : threatLevel < 70
              ? "Caution - Monitor mass levels"
              : "CRITICAL - Immediate action required!"}
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mass */}
          <div className="p-4 rounded-lg bg-background/50 border border-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4 text-blue-400" />
              <h4 className="font-medium text-foreground/90">Mass</h4>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {(blackHole.mass || 0).toFixed(4)} M☉
            </p>
            <p className="text-xs text-muted-foreground">
              Growth: +{(blackHole.massGrowthRate || 0).toFixed(6)}/s
            </p>
          </div>

          {/* Dark Matter Generation */}
          <div className="p-4 rounded-lg bg-background/50 border border-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Atom className="h-4 w-4 text-purple-400" />
              <h4 className="font-medium text-foreground/90">Dark Matter</h4>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {(blackHole.darkMatterAmount || 0).toFixed(6)}
            </p>
            <p className="text-xs text-muted-foreground">Dark Matter Amount</p>
          </div>

          {/* Energy Generation */}
          <div className="p-4 rounded-lg bg-background/50 border border-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <h4 className="font-medium text-foreground/90">Energy Output</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              +{formatNumber(blackHole.energyRate || 0)}/s
            </p>
            <p className="text-xs text-muted-foreground">
              Total: {formatNumber(blackHole.totalEnergyProduced || 0)}
            </p>
          </div>

          {/* Age */}
          <div className="p-4 rounded-lg bg-background/50 border border-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <h4 className="font-medium text-foreground/90">Age</h4>
            </div>
            <p className="text-2xl font-bold text-orange-400">
              {formatAge(blackHole.ageInSeconds || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Million years</p>
          </div>
        </div>

        {/* Advanced Statistics */}
        {showAdvancedStats && (
          <div className="space-y-4 border-t border-muted/30 pt-4">
            <h3 className="font-medium text-foreground/90 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Advanced Physics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-background/30 border border-muted/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Schwarzschild Radius
                </p>
                <p className="font-bold text-cyan-400">
                  {(blackHole.schwarzschildRadius || 0).toFixed(3)} km
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/30 border border-muted/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Hawking Temperature
                </p>
                <p className="font-bold text-cyan-400">
                  {(blackHole.hawkingTemperature || 0).toExponential(2)} K
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/30 border border-muted/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Estimated Lifetime
                </p>
                <p className="font-bold text-cyan-400">
                  {formatNumber(blackHole.estimatedLifetime || 0)} years
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/30 border border-muted/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Growth Multiplier
                </p>
                <p className="font-bold text-cyan-400">
                  {(blackHole.currentGrowthMultiplier || 0).toFixed(3)}x
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/30 border border-muted/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Critical Mass
                </p>
                <p className="font-bold text-cyan-400">
                  {(blackHole.criticalMass || 0).toFixed(1)} M☉
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/30 border border-muted/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Mass Progress
                </p>
                <p className="font-bold text-cyan-400">
                  {((blackHole.mass / blackHole.criticalMass) * 100).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Control Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={convertMassToDarkMatter}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
          >
            <ArrowRight className="h-4 w-4" />
            Convert Mass to Dark Matter
          </button>

          <button
            onClick={stabilizeBlackHole}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            <Shield className="h-4 w-4" />
            Stabilize Black Hole
          </button>
        </div>

        {/* Warning Message */}
        {threatLevel > 70 && (
          <div className="p-4 rounded-lg bg-red-900/20 border-2 border-red-800 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h4 className="font-bold text-red-400">CRITICAL WARNING</h4>
            </div>
            <p className="text-sm text-red-300">
              Black hole mass is approaching critical levels! Convert mass to
              dark matter immediately or risk planetary annihilation. Your
              colony&apos;s survival depends on maintaining balance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlackHole;
