import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import PressableScale from '../PressableScale';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export default function ShutterButton({ onPress, disabled }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Take photo"
      accessibilityState={{ disabled }}
      pressedScale={0.9}
      className={`h-[82px] w-[82px] items-center justify-center rounded-full border-4 border-white/90 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <LinearGradient
        colors={['#FF8FD1', '#FF4FA3', '#A855F7']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        className="h-[64px] w-[64px] overflow-hidden rounded-full"
      >
        <View className="absolute inset-x-[5px] top-[2px] h-1/2 rounded-full bg-white/25" />
      </LinearGradient>
    </PressableScale>
  );
}
