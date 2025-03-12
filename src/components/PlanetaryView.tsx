import React, { useRef, useEffect, useState, memo } from 'react';
import { useGame } from '@/context/GameContext';

export const PlanetaryView: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useGame();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Canvas dimensions
  const width = 400;
  const height = 400;
  
  // Animation control - using useRef to avoid recalculations
  const rotationAngleRef = useRef(0);
  const frameIdRef = useRef<number>();
  const lastTimeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // High resolution canvas
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    
    // Planet parameters
    const planetRadius = 120;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Generate stars once to improve performance
    const stars: { x: number; y: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7
      });
    }
    
    // Colors for building types
    const buildingColors: Record<string, string> = {
      oxygenGenerator: '#22d3ee',
      hydroponicFarm: '#4ade80',
      solarPanel: '#facc15',
      metalMine: '#a1a1aa',
      researchLab: '#d8b4fe',
      housing: '#60a5fa'
    };
    
    // Use requestAnimationFrame with timestamp for smooth animation
    const renderFrame = (timestamp: number) => {
      // Control FPS for performance
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < 16) { // Limit to ~60fps
        frameIdRef.current = requestAnimationFrame(renderFrame);
        return;
      }
      
      lastTimeRef.current = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw planet shadow
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(centerX + 5, centerY + 5, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Draw planet
      ctx.globalAlpha = 1;
      const gradient = ctx.createRadialGradient(
        centerX - 30, centerY - 30, 10,
        centerX, centerY, planetRadius
      );
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw atmosphere glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.lineWidth = 10;
      ctx.stroke();
      
      // Calculate building positions only when needed
      const buildingPositions = state.buildings.map((building, index) => {
        const angle = (index / state.buildings.length) * Math.PI * 2;
        const distance = planetRadius * 0.6 + (building.id.charCodeAt(0) % 30) / 100 * (planetRadius * 0.3);
        return {
          angle,
          distance,
          type: building.type,
          size: 3 + building.level * 1.5
        };
      });
      
      // Draw buildings with improved performance
      buildingPositions.forEach(building => {
        // Rotate position around center (with optimized rotation calculation)
        const adjustedAngle = building.angle + rotationAngleRef.current;
        const rotatedX = centerX + Math.cos(adjustedAngle) * building.distance;
        const rotatedY = centerY + Math.sin(adjustedAngle) * building.distance;
        
        // Draw building
        ctx.fillStyle = buildingColors[building.type] || '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(rotatedX, rotatedY, building.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(rotatedX, rotatedY, building.size + 2, 0, Math.PI * 2);
        ctx.strokeStyle = buildingColors[building.type] || '#ffffff';
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      
      // Very slowly rotate the buildings - with better performance
      rotationAngleRef.current += 0.0003;
      
      // Keep animating
      frameIdRef.current = requestAnimationFrame(renderFrame);
      
      // Mark as loaded after first render
      if (!isLoaded) {
        setIsLoaded(true);
      }
    };
    
    frameIdRef.current = requestAnimationFrame(renderFrame);
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [state.buildings, isLoaded]);
  
  return (
    <div className="glass-panel p-4 relative animate-fade-in">
      <h2 className="text-lg font-medium text-foreground/90 mb-2">Planetary View</h2>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-w-[400px] rounded-full animate-pulse-subtle"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
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
        Colony: New Hope • Buildings: {state.buildings.length} • Population: {state.population.total}
      </div>
    </div>
  );
});

PlanetaryView.displayName = 'PlanetaryView';
