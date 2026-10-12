import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  /** Wash color at the top-right corner. */
  color?: string;
};

/** Soft ambient light in the top-right corner of a screen. */
export default function GlowBackdrop({ color = 'rgba(168, 85, 247, 0.22)' }: Props) {
  return (
    <LinearGradient
      // Fully transparent before the bottom edge so the wash has no visible cutoff.
      colors={[color, 'transparent']}
      locations={[0, 0.7]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="absolute inset-x-0 top-0 h-[420px]"
      pointerEvents="none"
    />
  );
}
