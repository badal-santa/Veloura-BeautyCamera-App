import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors } from '../theme/colors';

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function GradientButton({ label, onPress, icon = 'arrow-right' }: Props) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.glow, pressStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => scale.set(withSpring(0.97))}
        onPressOut={() => scale.set(withSpring(1))}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primary, '#F0619E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text className="font-bold text-base text-white">{label}</Text>
          {icon && <MaterialCommunityIcons name={icon} size={20} color={Colors.white} />}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glow: {
    borderRadius: 30,
    boxShadow: '0 10px 28px rgba(255, 79, 163, 0.45)',
  },
  button: {
    height: 58,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
