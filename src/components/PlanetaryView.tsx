import React, { useRef, useEffect, useState, memo } from "react";
import { useGame } from "@/context/GameContext";

export const PlanetaryView: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useGame();
  const [isLoaded, setIsLoaded] = useState(false);

  const width = 400;
  const height = 400;

  // Ref-y do animacji
  const rotationAngleRef = useRef(0);
  const frameIdRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const starsRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      angle: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Inicjalizacja canvas
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Generowanie gwiazd tylko raz
    if (starsRef.current.length === 0) {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5,
          opacity: 0.3 + Math.random() * 0.7,
          speed: 0.1 + Math.random() * 0.3, // Różne prędkości
          angle: Math.random() * Math.PI * 2, // Losowe kierunki
        });
      }
      starsRef.current = newStars;
    }

    // Parametry planety
    const planetRadius = 120;
    const centerX = width / 2;
    const centerY = height / 2;

    // Kolory budynków
    const buildingColors: Record<string, string> = {
      oxygenGenerator: "#22d3ee",
      hydroponicFarm: "#4ade80",
      solarPanel: "#facc15",
      metalMine: "#a1a1aa",
      researchLab: "#d8b4fe",
      housing: "#60a5fa",
    };

    const renderFrame = (timestamp: number) => {
      const elapsedTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Aktualizacja pozycji gwiazd
      starsRef.current.forEach((star) => {
        const deltaX = Math.cos(star.angle) * star.speed * (elapsedTime / 16);
        const deltaY = Math.sin(star.angle) * star.speed * (elapsedTime / 16);

        star.x = (star.x + deltaX + width) % width;
        star.y = (star.y + deltaY + height) % height;
      });

      // Czyszczenie canvas
      ctx.clearRect(0, 0, width, height);

      // Rysowanie gwiazd
      ctx.fillStyle = "#ffffff";
      starsRef.current.forEach((star) => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rysowanie planety
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(centerX + 5, centerY + 5, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // Główna planeta
      ctx.globalAlpha = 1;
      const gradient = ctx.createRadialGradient(
        centerX - 30,
        centerY - 30,
        10,
        centerX,
        centerY,
        planetRadius
      );
      gradient.addColorStop(0, "#1e293b");
      gradient.addColorStop(1, "#0f172a");

      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Atmosfera
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
      ctx.lineWidth = 10;
      ctx.stroke();

      // Budynki
      const buildingPositions = state.buildings.map((building, index) => {
        const angle = (index / state.buildings.length) * Math.PI * 2;
        const distance =
          planetRadius * 0.6 +
          ((building.id.charCodeAt(0) % 30) / 100) * (planetRadius * 0.3);
        return {
          angle,
          distance,
          type: building.type,
          size: 3 + building.tier * 1.5,
        };
      });

      buildingPositions.forEach((building) => {
        const adjustedAngle = building.angle + rotationAngleRef.current;
        const rotatedX = centerX + Math.cos(adjustedAngle) * building.distance;
        const rotatedY = centerY + Math.sin(adjustedAngle) * building.distance;

        // Rysowanie budynku
        ctx.fillStyle = buildingColors[building.type] || "#ffffff";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(rotatedX, rotatedY, building.size, 0, Math.PI * 2);
        ctx.fill();

        // Efekt świetlny
        ctx.beginPath();
        ctx.arc(rotatedX, rotatedY, building.size + 2, 0, Math.PI * 2);
        ctx.strokeStyle = buildingColors[building.type] || "#ffffff";
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      rotationAngleRef.current += 0.0003 * (elapsedTime / 16);
      frameIdRef.current = requestAnimationFrame(renderFrame);

      if (!isLoaded) setIsLoaded(true);
    };

    frameIdRef.current = requestAnimationFrame(renderFrame);
    return () => frameIdRef.current && cancelAnimationFrame(frameIdRef.current);
  }, [state.buildings, isLoaded]);

  return (
    <div className="glass-panel p-4 relative animate-fade-in">
      <h2 className="text-lg font-medium text-foreground/90 mb-2">
        Planetary View
      </h2>

      <div className="flex items-center justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-w-[400px] rounded-full animate-pulse-subtle"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 10s ease-in-out",
            }}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Colony: 新大陸 • Buildings: {state.buildings.length} • Population:{" "}
        {state.population.total}
      </div>
    </div>
  );
});

PlanetaryView.displayName = "PlanetaryView";
