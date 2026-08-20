/**
 * Motion (Framer Motion) Configuration
 * 
 * Ensures all colors used in animations are in hex format
 * to prevent oklch color animation errors.
 */

// Export utility to convert any color to hex if needed
export function ensureHexColor(color: string): string {
  // If already hex, return as-is
  if (color.startsWith('#')) {
    return color;
  }
  
  // If rgb/rgba, convert to hex
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
  }
  
  // Return as-is if can't convert (fallback)
  return color;
}

// Common animation color variants (all in hex)
export const animationColors = {
  emerald: {
    500: '#10b981',
    600: '#059669',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
  },
  red: {
    500: '#ef4444',
    600: '#dc2626',
  },
  amber: {
    500: '#f59e0b',
    600: '#d97706',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};
