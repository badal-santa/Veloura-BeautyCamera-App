import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: string;
  colors: readonly [string, string, ...string[]];
  className?: string;
  style?: TextStyle;
  /** Sweeps a soft highlight across the text on a loop. */
  shimmer?: boolean;
  shimmerDelay?: number;
};

const SHIMMER_WIDTH = 90;

export default function GradientText({
  children,
  colors,
  className,
  style,
  shimmer = false,
  shimmerDelay = 0,
}: Props) {
  const width = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!shimmer) return;
    progress.value = withDelay(
      shimmerDelay,
      withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.cubic) }),
        -1,
      ),
    );
  }, [shimmer, shimmerDelay, progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          -SHIMMER_WIDTH + progress.value * (width.value + SHIMMER_WIDTH * 2),
      },
      { skewX: '-20deg' },
    ],
  }));

  const text = (hidden = false) => (
    <Text className={className} style={[style, hidden && styles.hidden]}>
      {children}
    </Text>
  );

  return (
    <MaskedView maskElement={text()}>
      <View onLayout={(e) => (width.value = e.nativeEvent.layout.width)}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {text(true)}
        </LinearGradient>
        {shimmer && (
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.9)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}
      </View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  hidden: { opacity: 0 },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SHIMMER_WIDTH,
  },
});
