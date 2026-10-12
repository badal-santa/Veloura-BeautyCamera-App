import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '../theme/colors';

type Props = {
  size?: number;
  thickness?: number;
};

export default function LoadingSpinner({ size = 32, thickness = 2.5 }: Props) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1100, easing: Easing.linear }),
      -1,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: Colors.glass,
          borderTopColor: Colors.primaryLight,
          borderRightColor: Colors.primary,
          boxShadow: `0 0 14px rgba(255, 79, 163, 0.35)`,
        },
        animatedStyle,
      ]}
    />
  );
}
