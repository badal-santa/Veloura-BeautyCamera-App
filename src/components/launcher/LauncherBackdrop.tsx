import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { ACCENTS, useSettings } from '../../features/settings/settings';

/** Cinematic scrims over the system wallpaper so text and glass stay legible. */
export default function LauncherBackdrop() {
  const accent = ACCENTS[useSettings().accent];
  return (
    <View className="absolute inset-0" pointerEvents="none">
      <LinearGradient
        colors={['rgba(8, 7, 12, 0.82)', 'rgba(8, 7, 12, 0.25)', 'rgba(8, 7, 12, 0)']}
        locations={[0, 0.32, 0.5]}
        className="absolute inset-0"
      />
      <LinearGradient
        colors={['rgba(8, 7, 12, 0)', 'rgba(8, 7, 12, 0.6)', 'rgba(8, 7, 12, 0.94)']}
        locations={[0.45, 0.75, 1]}
        className="absolute inset-0"
      />
      <LinearGradient
        colors={[accent.glow, 'rgba(8, 7, 12, 0)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.45 }}
        className="absolute inset-0"
      />
    </View>
  );
}
