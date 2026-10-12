import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { ACCENTS, ICON_PX, LABEL_PX, useSettings } from '../../features/settings/settings';

const ICON_COLORS = ['bg-sky-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-violet-400', 'bg-teal-400', 'bg-orange-400', 'bg-fuchsia-400', 'bg-lime-400', 'bg-indigo-400'];

/** Mini phone that reflects Home / Drawer settings live. */
export default function LauncherPreview({ variant }: { variant: 'home' | 'drawer' }) {
  const s = useSettings();
  const accent = ACCENTS[s.accent];
  const columns = variant === 'home' ? s.homeColumns : s.drawerColumns;
  const showLabels = variant === 'home' ? s.homeLabels : s.drawerLabels;
  // Scale real dp sizes down to the preview.
  const icon = (variant === 'home' ? ICON_PX[s.homeIconSize] : columns === 5 ? 46 : 54) * 0.5;
  const label = (variant === 'home' ? LABEL_PX[s.homeLabelSize] : 11) * 0.6;
  const count = columns * 2;

  return (
    <View className="mx-5 items-center overflow-hidden rounded-[26px] border border-white/10 py-5">
      <LinearGradient colors={['#2A0F2E', '#120B22', '#08070C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
      <LinearGradient colors={[accent.glow, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 0.7 }} className="absolute inset-0" />

      <View className="w-[210px] overflow-hidden rounded-[22px] border-4 border-white/15 bg-black/40 px-3 pb-4 pt-5">
        {variant === 'drawer' && (
          <View className="absolute inset-0 bg-surface" style={{ opacity: s.drawerOpacity / 100 }} />
        )}
        <Text className="mb-3 font-bold text-[9px] text-white/70">
          {variant === 'home' ? 'Veloura Home' : 'All apps'}
        </Text>
        <View className="flex-row flex-wrap" style={{ rowGap: 10 }}>
          {Array.from({ length: count }, (_, i) => (
            <View key={i} className="items-center" style={{ width: `${100 / columns}%` }}>
              <View className={`rounded-[8px] ${ICON_COLORS[i % ICON_COLORS.length]}`} style={{ width: icon, height: icon }} />
              {showLabels && (
                <Text className="mt-1 font-medium text-white/80" style={{ fontSize: label }} numberOfLines={1}>
                  App
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
      <Text className="mt-3 font-medium text-[11px] text-white/50">Live preview</Text>
    </View>
  );
}
