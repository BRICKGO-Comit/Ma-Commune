/**
 * MA COMMUNE — Design System (Premium Emerald & Gold Edition)
 * Optimized for Glassmorphism, modern shadows, and high contrast.
 */

export const Colors = {
  // Brand Colors (Derived from Official Logo)
  primary: '#2D6A4F',       // Emerald Green
  primaryDark: '#1B4332',   // Deep Forest Green
  primaryLight: '#52B788',  // Mint/Light Emerald
  accent: '#FFD700',        // Golden Yellow (from logo dots)
  accentDark: '#D97706',    // Amber/Gold
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAF5',    // Subtle off-white/greenish tint
  slate: '#1E293B',         // Deep slate for typography
  
  // UI Colors
  text: '#1B4332',          // Dark Green text
  textSecondary: '#64748B', // Slate text
  textLight: '#94A3B8',
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  
  // Glassmorphism Helpers
  glass: 'rgba(255, 255, 255, 0.85)',
  glassDark: 'rgba(27, 67, 50, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
};

export const Gradients = {
  emerald: ['#2D6A4F', '#1B4332'],
  gold: ['#FFD700', '#D97706'],
  mesh: ['#1B4332', '#2D6A4F', '#40916C'],
  whiteGlass: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
};

export const Fonts = {
  weights: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    extrabold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  xs: 6,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const Shadows = {
  soft: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  premium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 15,
  },
};
