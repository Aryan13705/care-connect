// Design Tokens for CareConnect Design System

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  isDark: boolean;
  mint?: string;
  cream?: string;
  peach?: string;
  sidebar?: string;
}

export const PATIENT_LIGHT_THEME: ThemeColors = {
  primary: '#58A88D',
  primaryDark: '#347C65',
  background: '#FAFBF8',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#26352F',
  mutedText: '#819089',
  border: '#E7EDE8',
  accent: '#58A88D',
  mint: '#E7F4ED',
  cream: '#F8F2E8',
  peach: '#FBE9DF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  isDark: false,
};

export const PATIENT_DARK_THEME: ThemeColors = {
  primary: '#66BFA2',
  primaryDark: '#58A88D',
  background: '#121A16',
  surface: '#1A2420',
  card: '#1F2C27',
  text: '#EAF2EE',
  mutedText: '#8F9E97',
  border: '#273830',
  accent: '#66BFA2',
  mint: '#1F332A',
  cream: '#2D271F',
  peach: '#32221D',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  isDark: true,
};

export const DOCTOR_LIGHT_THEME: ThemeColors = {
  primary: '#168B80',
  primaryDark: '#116C64',
  background: '#F7F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#24343C',
  mutedText: '#7C8B92',
  border: '#E6ECEE',
  accent: '#E3F3F0',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  isDark: false,
};

export const DOCTOR_DARK_THEME: ThemeColors = {
  primary: '#20A89C',
  primaryDark: '#168B80',
  background: '#0E171B',
  surface: '#152228',
  card: '#1B2C34',
  text: '#E2E9EC',
  mutedText: '#809199',
  border: '#22353E',
  accent: '#183B38',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  isDark: true,
};

export const ADMIN_LIGHT_THEME: ThemeColors = {
  primary: '#0D9488',
  primaryDark: '#0F766E',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  sidebar: '#0F172A',
  text: '#0F172A',
  mutedText: '#64748B',
  border: '#E2E8F0',
  accent: '#CCFBF1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  isDark: false,
};

export const ADMIN_DARK_THEME: ThemeColors = {
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  background: '#090D16',
  surface: '#0F172A',
  card: '#1E293B',
  sidebar: '#070C16',
  text: '#F8FAFC',
  mutedText: '#94A3B8',
  border: '#1E293B',
  accent: '#134E4A',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  isDark: true,
};
