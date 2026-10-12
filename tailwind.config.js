/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // Weight is baked into each Plus Jakarta family below, so drop Tailwind's
    // fontWeight utilities — `font-bold` etc. would otherwise also set fontWeight,
    // and Android falls back to the system font for custom fonts with a weight.
    fontWeight: {},
    extend: {
      // Mirrors src/theme/colors.ts — keep both in sync.
      colors: {
        background: { DEFAULT: '#08070C', secondary: '#111019' },
        surface: { DEFAULT: '#191522', light: '#211B2B', elevated: '#251E30' },
        primary: { DEFAULT: '#FF4FA3', light: '#FF78BA', dark: '#E63287' },
        secondary: { DEFAULT: '#A855F7', light: '#C084FC', dark: '#7E22CE' },
        accent: { DEFAULT: '#FFB38A', pink: '#FF8FD1' },
        ai: { DEFAULT: '#C084FC', blue: '#818CF8' },
        content: {
          primary: '#FAF8FC',
          secondary: '#A8A1B5',
          tertiary: '#716A7C',
          disabled: '#4B4555',
        },
        border: { DEFAULT: '#2A2335', light: '#352D42', active: '#FF4FA3' },
        premium: '#FFD166',
      },
      // Mirrors src/theme/fonts.ts — names match the keys loaded in App.tsx.
      fontFamily: {
        regular: ['PlusJakartaSans-Regular'],
        medium: ['PlusJakartaSans-Medium'],
        semibold: ['PlusJakartaSans-SemiBold'],
        bold: ['PlusJakartaSans-Bold'],
        extrabold: ['PlusJakartaSans-ExtraBold'],
      },
    },
  },
  plugins: [],
};
