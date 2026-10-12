import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { View } from 'react-native';

type Props = {
  value: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
  min?: number;
  max?: number;
  /** Fill from the zero point outward (for -100…100 ranges). */
  bipolar?: boolean;
};

export default function Slider({ value, onChange, accessibilityLabel, min = 0, max = 100, bipolar }: Props) {
  const track = useRef<View>(null);
  const geometry = useRef({ x: 0, width: 1 });

  const measure = () =>
    track.current?.measureInWindow((x, _y, width) => {
      geometry.current = { x, width: Math.max(width, 1) };
    });

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));
  const setFromPageX = (pageX: number) => {
    const ratio = (pageX - geometry.current.x) / geometry.current.width;
    onChange(clamp(min + ratio * (max - min)));
  };

  const percent = ((value - min) / (max - min)) * 100;
  const zero = bipolar ? ((0 - min) / (max - min)) * 100 : 0;

  return (
    <View
      ref={track}
      onLayout={measure}
      className="h-10 justify-center"
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e) => {
        measure();
        setFromPageX(e.nativeEvent.pageX);
      }}
      onResponderMove={(e) => setFromPageX(e.nativeEvent.pageX)}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) =>
        onChange(clamp(value + ((max - min) / 20) * (e.nativeEvent.actionName === 'increment' ? 1 : -1)))
      }
    >
      <View className="h-1 overflow-hidden rounded-full bg-white/15">
        <LinearGradient
          colors={['#FF78BA', '#A855F7']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="absolute bottom-0 top-0"
          // Dynamic geometry can't be expressed as static Tailwind classes.
          style={{ left: `${Math.min(zero, percent)}%`, width: `${Math.abs(percent - zero)}%` }}
        />
      </View>
      {bipolar && (
        <View className="absolute h-3 w-0.5 rounded-full bg-white/40" style={{ left: `${zero}%` }} />
      )}
      <View
        pointerEvents="none"
        className="absolute -ml-[11px] h-[22px] w-[22px] rounded-full border-2 border-white bg-primary shadow-md shadow-primary/60"
        style={{ left: `${percent}%` }}
      />
    </View>
  );
}
