import type { ViewStyle } from 'react-native';

/** Soft circular light — a radial gradient that fades to transparent. */
export const radialGlow = (color: string, size: number): ViewStyle => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: size / 2,
  experimental_backgroundImage: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
});
