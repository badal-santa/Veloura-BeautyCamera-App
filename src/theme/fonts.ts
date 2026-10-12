export const Fonts = {
  family: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semiBold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
  },

  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 38,
    '7xl': 44,
  },

  weight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  lineHeight: {
    xs: 14,
    sm: 18,
    md: 21,
    lg: 24,
    xl: 27,
    '2xl': 30,
    '3xl': 34,
    '4xl': 38,
    '5xl': 44,
    '6xl': 50,
    '7xl': 54,
  },
} as const;

export type FontSize = keyof typeof Fonts.size;
export type FontWeight = keyof typeof Fonts.weight;