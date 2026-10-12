import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { useHomeMode } from '../../features/launcher/useHomeMode';
import PressableScale from '../PressableScale';

/** Android-only switch for Veloura Home (launcher mode). */
export default function HomeModeCard() {
  const navigation = useNavigation();
  const { supported, enabled, isDefault, setEnabled, makeDefault } = useHomeMode();
  if (!supported) return null;

  const status = isDefault
    ? 'Active — Veloura is your Home screen'
    : enabled
      ? 'Ready — choose Veloura as your default Home'
      : 'Turn your Home screen into a glow studio';

  return (
    <View className="mx-5 overflow-hidden rounded-[24px] border border-white/10 bg-surface p-4">
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.22)', 'rgba(255, 79, 163, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-secondary/20">
          <MaterialCommunityIcons name="home-variant" className="text-[22px] text-secondary-light" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-bold text-base text-content-primary">Veloura Home</Text>
          <Text className="mt-0.5 font-regular text-xs text-content-secondary">{status}</Text>
        </View>
        <PressableScale
          onPress={() => setEnabled(!enabled)}
          accessibilityRole="switch"
          accessibilityState={{ checked: enabled }}
          accessibilityLabel="Use Veloura as Home screen"
          pressedScale={0.94}
          className={`h-[30px] w-[52px] justify-center rounded-full px-[3px] ${
            enabled ? 'items-end bg-primary' : 'items-start bg-white/15'
          }`}
        >
          <View className="h-6 w-6 rounded-full bg-white" />
        </PressableScale>
      </View>

      {isDefault && (
        <Text className="mt-3 font-regular text-[11px] leading-4 text-content-tertiary">
          Swipe-up gesture still opens your old Home? Restart your phone once so it picks up Veloura.
        </Text>
      )}

      <View className="mt-4 flex-row gap-2.5">
        {enabled && !isDefault && (
          <PressableScale
            onPress={makeDefault}
            accessibilityRole="button"
            className="flex-1 flex-row items-center justify-center rounded-full bg-primary py-2.5"
          >
            <MaterialCommunityIcons name="check-circle" className="text-base text-white" />
            <Text className="ml-1.5 font-bold text-[13px] text-white">Set as default</Text>
          </PressableScale>
        )}
        <PressableScale
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Launcher' }] })}
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center rounded-full border border-white/15 bg-white/5 py-2.5"
        >
          <MaterialCommunityIcons name="eye-outline" className="text-base text-white" />
          <Text className="ml-1.5 font-semibold text-[13px] text-white">Preview Home</Text>
        </PressableScale>
      </View>
    </View>
  );
}
