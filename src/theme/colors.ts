export const Colors = {
  primary: '#6200EE',
  primaryDark: '#2D4CC8',
  accent: '#3461FD',
  error: '#FF3B30',
  success: '#00C853',
  warning: '#FF9500',

  background: '#FFFFFF',
  surface: '#F5F9FE',
  card: '#FFFFFF',

  text: '#1A1A1A',
  textSecondary: '#7C8BA0',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  border: '#E0E0E0',
  borderLight: '#F0F2F5',
  borderAccent: '#6C9EFF',

  tabActive: '#6200EE',
  tabInactive: '#9CA3AF',

  podium: '#7F00FF',
  gold: '#FFD700',
  streak: '#FF6B00',

  progressTrack: '#F0F2F5',
  progressFill: '#2D4CC8',
} as const;

export type ThemeColors = { [K in keyof typeof Colors]: string };

// Paleta de alto contraste (WCAG 2.2 AA).
// Fundo claro com textos quase pretos e elementos saturados escuros,
// garantindo razão de contraste alta para baixa visão.
export const HighContrastColors: ThemeColors = {
  primary: '#3A00B8',
  primaryDark: '#1A237E',
  accent: '#0B3CC1',
  error: '#B00020',
  success: '#0B6E2E',
  warning: '#8A4B00',

  background: '#FFFFFF',
  surface: '#F2F2F2',
  card: '#FFFFFF',

  text: '#000000',
  textSecondary: '#1F1F1F',
  textLight: '#3D3D3D',
  textOnPrimary: '#FFFFFF',

  border: '#000000',
  borderLight: '#5C5C5C',
  borderAccent: '#0B3CC1',

  tabActive: '#3A00B8',
  tabInactive: '#3D3D3D',

  podium: '#3A00B8',
  gold: '#7A5C00',
  streak: '#A33A00',

  progressTrack: '#D6D6D6',
  progressFill: '#1A237E',
};
