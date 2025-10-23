// REBA Design System 2025 - React Native Theme
import { StyleSheet } from 'react-native';

export const REBATheme = {
  colors: {
    primary: {
      50: '#E6F3FF',
      100: '#CCE7FF',
      200: '#99CFFF',
      300: '#66B7FF',
      400: '#339FFF',
      500: '#0A84FF',
      600: '#086ACC',
      700: '#065099',
      800: '#043666',
      900: '#021D33',
    },
    secondary: {
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#BDC1C6',
      500: '#9AA0A6',
      600: '#80868B',
      700: '#5F6368',
      800: '#3C4043',
      900: '#202124',
    },
    semantic: {
      success: {
        50: '#E8F5E8',
        500: '#34A853',
        600: '#2E7D32',
        700: '#1B5E20',
      },
      warning: {
        50: '#FFF3E0',
        500: '#FF9800',
        600: '#F57C00',
        700: '#E65100',
      },
      error: {
        50: '#FFEBEE',
        500: '#F44336',
        600: '#E53935',
        700: '#D32F2F',
      },
      info: {
        50: '#E3F2FD',
        500: '#2196F3',
        600: '#1E88E5',
        700: '#1976D2',
      },
    },
    neutral: {
      white: '#FFFFFF',
      black: '#0B0B0B',
      gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      tertiary: '#F5F5F5',
      overlay: 'rgba(0, 0, 0, 0.5)',
      modal: 'rgba(0, 0, 0, 0.4)',
    },
    text: {
      primary: '#0B0B0B',
      secondary: '#424242',
      tertiary: '#757575',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
      accent: '#0A84FF',
    },
    border: {
      light: '#E0E0E0',
      medium: '#BDBDBD',
      dark: '#757575',
      focus: '#0A84FF',
    },
  },

  typography: {
    fontFamily: {
      primary: 'Inter',
      fallback: 'System',
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
    letterSpacing: {
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
    },
  },

  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },

  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 5,
    },
  },

  animation: {
    duration: {
      fast: 120,
      normal: 240,
      slow: 360,
      slower: 480,
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      deceleration: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      acceleration: 'cubic-bezier(0.4, 0.0, 1, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },

  accessibility: {
    minTouchTarget: 44,
    focusRing: {
      width: 2,
      color: '#0A84FF',
      offset: 2,
    },
  },
};

// Typography styles
export const typographyStyles = StyleSheet.create({
  h1: {
    fontSize: REBATheme.typography.fontSize['4xl'],
    fontWeight: REBATheme.typography.fontWeight.bold,
    lineHeight: REBATheme.typography.fontSize['4xl'] * REBATheme.typography.lineHeight.tight,
    letterSpacing: REBATheme.typography.letterSpacing.tight,
    color: REBATheme.colors.text.primary,
  },
  h2: {
    fontSize: REBATheme.typography.fontSize['3xl'],
    fontWeight: REBATheme.typography.fontWeight.bold,
    lineHeight: REBATheme.typography.fontSize['3xl'] * REBATheme.typography.lineHeight.tight,
    letterSpacing: REBATheme.typography.letterSpacing.tight,
    color: REBATheme.colors.text.primary,
  },
  h3: {
    fontSize: REBATheme.typography.fontSize['2xl'],
    fontWeight: REBATheme.typography.fontWeight.semibold,
    lineHeight: REBATheme.typography.fontSize['2xl'] * REBATheme.typography.lineHeight.normal,
    letterSpacing: REBATheme.typography.letterSpacing.normal,
    color: REBATheme.colors.text.primary,
  },
  h4: {
    fontSize: REBATheme.typography.fontSize.xl,
    fontWeight: REBATheme.typography.fontWeight.semibold,
    lineHeight: REBATheme.typography.fontSize.xl * REBATheme.typography.lineHeight.normal,
    letterSpacing: REBATheme.typography.letterSpacing.normal,
    color: REBATheme.colors.text.primary,
  },
  body: {
    fontSize: REBATheme.typography.fontSize.base,
    fontWeight: REBATheme.typography.fontWeight.regular,
    lineHeight: REBATheme.typography.fontSize.base * REBATheme.typography.lineHeight.relaxed,
    letterSpacing: REBATheme.typography.letterSpacing.normal,
    color: REBATheme.colors.text.primary,
  },
  bodySmall: {
    fontSize: REBATheme.typography.fontSize.sm,
    fontWeight: REBATheme.typography.fontWeight.regular,
    lineHeight: REBATheme.typography.fontSize.sm * REBATheme.typography.lineHeight.normal,
    letterSpacing: REBATheme.typography.letterSpacing.normal,
    color: REBATheme.colors.text.secondary,
  },
  caption: {
    fontSize: REBATheme.typography.fontSize.xs,
    fontWeight: REBATheme.typography.fontWeight.regular,
    lineHeight: REBATheme.typography.fontSize.xs * REBATheme.typography.lineHeight.normal,
    letterSpacing: REBATheme.typography.letterSpacing.wide,
    color: REBATheme.colors.text.tertiary,
  },
  button: {
    fontSize: REBATheme.typography.fontSize.base,
    fontWeight: REBATheme.typography.fontWeight.semibold,
    lineHeight: REBATheme.typography.fontSize.base * REBATheme.typography.lineHeight.tight,
    letterSpacing: REBATheme.typography.letterSpacing.normal,
  },
  buttonSmall: {
    fontSize: REBATheme.typography.fontSize.sm,
    fontWeight: REBATheme.typography.fontWeight.semibold,
    lineHeight: REBATheme.typography.fontSize.sm * REBATheme.typography.lineHeight.tight,
    letterSpacing: REBATheme.typography.letterSpacing.normal,
  },
});

// Component styles
export const componentStyles = StyleSheet.create({
  button: {
    backgroundColor: REBATheme.colors.primary[500],
    paddingHorizontal: REBATheme.spacing[6],
    paddingVertical: REBATheme.spacing[4],
    borderRadius: REBATheme.borderRadius.md,
    ...REBATheme.shadows.sm,
    minHeight: REBATheme.accessibility.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: REBATheme.colors.neutral.white,
    borderWidth: 1,
    borderColor: REBATheme.colors.border.light,
    paddingHorizontal: REBATheme.spacing[6],
    paddingVertical: REBATheme.spacing[4],
    borderRadius: REBATheme.borderRadius.md,
    minHeight: REBATheme.accessibility.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: REBATheme.colors.neutral.white,
    borderRadius: REBATheme.borderRadius.lg,
    padding: REBATheme.spacing[4],
    ...REBATheme.shadows.base,
  },
  input: {
    backgroundColor: REBATheme.colors.neutral.white,
    borderWidth: 1,
    borderColor: REBATheme.colors.border.light,
    borderRadius: REBATheme.borderRadius.md,
    paddingHorizontal: REBATheme.spacing[4],
    paddingVertical: REBATheme.spacing[3],
    fontSize: REBATheme.typography.fontSize.base,
    color: REBATheme.colors.text.primary,
    minHeight: REBATheme.accessibility.minTouchTarget,
  },
  inputFocused: {
    borderColor: REBATheme.colors.border.focus,
    borderWidth: 2,
  },
});

export default REBATheme;

