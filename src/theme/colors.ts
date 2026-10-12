export const Colors = {
  // ─────────────────────────────────────────────
  // Base
  // ─────────────────────────────────────────────
  background: '#08070C',
  backgroundSecondary: '#111019',
  surface: '#191522',
  surfaceLight: '#211B2B',
  surfaceElevated: '#251E30',

  // ─────────────────────────────────────────────
  // Brand
  // ─────────────────────────────────────────────
  primary: '#FF4FA3',
  primaryLight: '#FF78BA',
  primaryDark: '#E63287',

  secondary: '#A855F7',
  secondaryLight: '#C084FC',
  secondaryDark: '#7E22CE',

  // ─────────────────────────────────────────────
  // Accent / AI
  // ─────────────────────────────────────────────
  accent: '#FFB38A',
  accentPink: '#FF8FD1',
  ai: '#C084FC',
  aiBlue: '#818CF8',

  // ─────────────────────────────────────────────
  // Gradients
  // ─────────────────────────────────────────────
  gradientPrimary: [
    '#FF4FA3',
    '#A855F7',
    '#FFB38A',
  ] as const,

  gradientAI: [
    '#A855F7',
    '#6366F1',
  ] as const,

  gradientPremium: [
    '#FF4FA3',
    '#FF8FD1',
    '#FFB38A',
  ] as const,

  gradientDark: [
    '#191522',
    '#08070C',
  ] as const,

  // ─────────────────────────────────────────────
  // Text
  // ─────────────────────────────────────────────
  textPrimary: '#FAF8FC',
  textSecondary: '#A8A1B5',
  textTertiary: '#716A7C',
  textDisabled: '#4B4555',
  textOnPrimary: '#FFFFFF',

  // ─────────────────────────────────────────────
  // Borders
  // ─────────────────────────────────────────────
  border: '#2A2335',
  borderLight: '#352D42',
  borderActive: '#FF4FA3',

  // ─────────────────────────────────────────────
  // Status
  // ─────────────────────────────────────────────
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // ─────────────────────────────────────────────
  // Overlay
  // ─────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayLight: 'rgba(0, 0, 0, 0.30)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',

  // ─────────────────────────────────────────────
  // Glass
  // ─────────────────────────────────────────────
  glass: 'rgba(255, 255, 255, 0.08)',
  glassLight: 'rgba(255, 255, 255, 0.12)',
  glassDark: 'rgba(8, 7, 12, 0.75)',

  // ─────────────────────────────────────────────
  // Camera
  // ─────────────────────────────────────────────
  cameraOverlay: 'rgba(0, 0, 0, 0.35)',
  cameraControl: 'rgba(255, 255, 255, 0.12)',
  cameraControlActive: '#FF4FA3',
  cameraText: '#FFFFFF',

  // ─────────────────────────────────────────────
  // Premium
  // ─────────────────────────────────────────────
  premium: '#FFD166',
  premiumBackground: 'rgba(255, 209, 102, 0.12)',
  premiumBorder: 'rgba(255, 209, 102, 0.35)',

  // ─────────────────────────────────────────────
  // Common
  // ─────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;