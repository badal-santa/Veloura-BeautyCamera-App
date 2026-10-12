import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. */
  pressedScale?: number;
};

export default function PressableScale({
  children,
  className,
  style,
  pressedScale = 0.96,
  onPressIn,
  onPressOut,
  ...pressableProps
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...pressableProps}
      className={className}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        scale.set(withSpring(pressedScale, { damping: 18, stiffness: 300 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, { damping: 18, stiffness: 300 }));
        onPressOut?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}
