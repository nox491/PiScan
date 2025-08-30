import { Platform } from 'react-native';

/**
 * Reusable style constants to eliminate duplication across components
 */

// Common spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Common border radius values
export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
} as const;

// Common background colors with transparency
export const BACKGROUND_COLORS = {
  light: 'rgba(0,0,0,0.02)',
  medium: 'rgba(0,0,0,0.05)',
  dark: 'rgba(0,0,0,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
  overlayDark: 'rgba(0,0,0,0.7)',
  overlayDarker: 'rgba(0,0,0,0.8)',
} as const;

// Common padding combinations
export const PADDING = {
  horizontal: {
    sm: { paddingHorizontal: SPACING.sm },
    md: { paddingHorizontal: SPACING.md },
    lg: { paddingHorizontal: SPACING.lg },
    xl: { paddingHorizontal: SPACING.xl },
  },
  vertical: {
    sm: { paddingVertical: SPACING.sm },
    md: { paddingVertical: SPACING.md },
    lg: { paddingVertical: SPACING.lg },
    xl: { paddingVertical: SPACING.xl },
  },
  all: {
    sm: { padding: SPACING.sm },
    md: { padding: SPACING.md },
    lg: { padding: SPACING.lg },
    xl: { padding: SPACING.xl },
  },
} as const;

// Common margin combinations
export const MARGIN = {
  bottom: {
    sm: { marginBottom: SPACING.sm },
    md: { marginBottom: SPACING.md },
    lg: { marginBottom: SPACING.lg },
    xl: { marginBottom: SPACING.xl },
  },
  top: {
    sm: { marginTop: SPACING.sm },
    md: { marginTop: SPACING.md },
    lg: { marginTop: SPACING.lg },
    xl: { marginTop: SPACING.xl },
  },
} as const;

// Common flex layouts
export const FLEX = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
} as const;

// Common card styles
export const CARD_STYLES = {
  base: {
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: BACKGROUND_COLORS.light,
    overflow: 'hidden' as const,
  },
  withBorder: {
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: BACKGROUND_COLORS.light,
    overflow: 'hidden' as const,
    borderLeftWidth: 4,
  },
  interactive: {
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: BACKGROUND_COLORS.medium,
  },
} as const;

// Common button styles
export const BUTTON_STYLES = {
  primary: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#4CAF50',
  },
  secondary: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: BACKGROUND_COLORS.medium,
  },
  icon: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: BACKGROUND_COLORS.medium,
  },
} as const;

// Common text styles
export const TEXT_STYLES = {
  heading: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  subheading: {
    fontSize: 14,
    opacity: 0.7,
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    opacity: 0.6,
  },
} as const;

// Platform-specific adjustments
export const PLATFORM = {
  ios: Platform.OS === 'ios',
  android: Platform.OS === 'android',
  web: Platform.OS === 'web',
} as const;

// Common shadow styles (iOS specific)
export const SHADOW = {
  light: Platform.OS === 'ios' ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  } : {
    elevation: 2,
  },
  medium: Platform.OS === 'ios' ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },
} as const;
