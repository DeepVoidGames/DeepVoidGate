
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a number with appropriate suffixes (K, M, B, etc.)
export function formatNumber(num: number): string {
  if (num === 0) return '0';
  
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
    return num.toFixed(1).replace(/\.0$/, '');
  }
  
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  
  // Determine the appropriate suffix
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
  const scaledNumber = num / Math.pow(10, magnitude * 3);
  
  // Format the scaled number with 1 decimal place, but remove trailing zeros
  const formattedNumber = scaledNumber.toFixed(1).replace(/\.0$/, '');
  
  return `${formattedNumber}${suffixes[magnitude]}`;
}
