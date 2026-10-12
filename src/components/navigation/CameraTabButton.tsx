import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/** Raised hero button for the center of the tab bar. */
export default function CameraTabButton() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }), -1);
  }, [pulse]);

  // Soft halo that ripples outward and fades.
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 0.35 }],
  }));

  return (
    <View className="-mt-9 h-[76px] w-[76px] items-center justify-center">
      <Animated.View
        style={haloStyle}
        className="absolute h-[64px] w-[64px] rounded-full bg-primary"
      />

      {/* Dark ring separates the orb from the tab bar */}
      <View className="h-[70px] w-[70px] rounded-full bg-background p-[4px] shadow-lg shadow-primary/60">
        <LinearGradient
          colors={['#FF8FD1', '#FF4FA3', '#A855F7']}
          locations={[0, 0.45, 1]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          className="flex-1 items-center justify-center overflow-hidden rounded-full border border-white/25"
        >
          {/* Glossy top highlight */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0)']}
            className="absolute inset-x-[5px] top-[2px] h-1/2 rounded-full"
          />
          <MaterialCommunityIcons name="camera" className="text-[28px] text-white" />
          <MaterialCommunityIcons
            name="star-four-points"
            className="absolute right-[13px] top-[12px] text-[10px] text-white"
          />
        </LinearGradient>
      </View>
    </View>
  );
}
