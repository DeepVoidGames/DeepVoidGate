import { getSettings } from "@/pages/Settings";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a number with appropriate suffixes (K, M, B, etc.)
// Format a number with appropriate suffixes (K, M, B, etc.) or scientific notation
export function formatNumber(num: number): string {
  if (num === 0) return "0";
  if (num === Infinity) return "∞";
  if (num === -Infinity) return "-∞";
  if (isNaN(num)) return "NaN";
  if (num == undefined) return "undefined";

  const isScientificNotation =
    getSettings().compactUIOptions?.isScientificNotation;

  if (Math.abs(num) < 1) {
    // Format small numbers with appropriate precision
    if (Math.abs(num) < 0.01) {
      return num.toExponential(1);
    } else {
      return num.toFixed(2);
    }
  }

  // Integer or float check
  const isInteger = num % 1 === 0;

  if (isInteger && Math.abs(num) < 1000) {
    return Math.round(num).toString();
  } else if (!isInteger && Math.abs(num) < 1000) {
    // For non-integers less than 1000, format with up to 1 decimal place
    return num.toFixed(1).replace(/\.0$/, "");
  }

  const suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
  ];

  // Determine the appropriate suffix
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
  const scaledNumber = num / Math.pow(10, magnitude * 3);
  const formattedNumber = scaledNumber.toFixed(1).replace(/\.0$/, "");

  if (isScientificNotation) {
    const exponent = magnitude * 3;
    return `${formattedNumber}e${exponent}`;
  }

  return `${formattedNumber}${suffixes[magnitude]}`;
}

export type Noise2D = (x: number, y: number) => number;

/**
 * Fractal noise generator for visual effects.
 * @param width Width of the generated texture.
 * @param height Height of the generated texture.
 * @param options Noise configuration options.
 * @returns Two-dimensional array of noise values in the range [0, 1].
 */
export const generateNoise = (
  width: number,
  height: number,
  options: {
    octaves?: number;
    persistence?: number;
    scale?: number;
    seed?: number;
  } = {}
): number[][] => {
  const {
    octaves = 4,
    persistence = 0.5,
    scale = 50,
    seed = Math.random(),
  } = options;

  // Generator liczb pseudolosowych z seedem
  const random = (x: number, y: number): number => {
    const angle = (x: number, y: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
      return n - Math.floor(n);
    };
    return angle(x, y);
  };

  // Interpolacja kosinusowa
  const interpolate = (a: number, b: number, t: number): number => {
    const ft = t * Math.PI;
    const f = (1 - Math.cos(ft)) * 0.5;
    return a * (1 - f) + b * f;
  };

  // Szum dla pojedynczego octave
  const smoothNoise = (baseX: number, baseY: number): number => {
    const x = baseX / scale;
    const y = baseY / scale;

    const xInt = Math.floor(x);
    const yInt = Math.floor(y);

    const xFrac = x - xInt;
    const yFrac = y - yInt;

    // Wartości w narożnikach
    const nw = random(xInt, yInt);
    const ne = random(xInt + 1, yInt);
    const sw = random(xInt, yInt + 1);
    const se = random(xInt + 1, yInt + 1);

    // Interpolacja w poziomie
    const top = interpolate(nw, ne, xFrac);
    const bottom = interpolate(sw, se, xFrac);

    // Interpolacja w pionie
    return interpolate(top, bottom, yFrac);
  };

  // Generuj fractal noise
  const noise: number[][] = [];
  let maxNoise = 0.0001; // Zabezpieczenie przed dzieleniem przez zero

  for (let x = 0; x < width; x++) {
    noise[x] = [];
    for (let y = 0; y < height; y++) {
      let amplitude = 1;
      let frequency = 1;
      let total = 0;

      for (let o = 0; o < octaves; o++) {
        total += smoothNoise(x * frequency, y * frequency) * amplitude;
        maxNoise = Math.max(maxNoise, total);
        amplitude *= persistence;
        frequency *= 2;
      }

      noise[x][y] = total;
    }
  }

  // Normalizacja do zakresu [0, 1]
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      noise[x][y] = (noise[x][y] + 1) / (2 * maxNoise);
    }
  }

  return noise;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Format the time remaining until next event
export const formatTimeRemaining = (timestamp) => {
  if (!timestamp) return "No events scheduled";

  const msRemaining = timestamp - Date.now();
  if (msRemaining <= 0) return "Event imminent";

  const seconds = Math.floor((msRemaining / 1000) % 60);
  const minutes = Math.floor((msRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((msRemaining / (1000 * 60 * 60)) % 24);

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
};
