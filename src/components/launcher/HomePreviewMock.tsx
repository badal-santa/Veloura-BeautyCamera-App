import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

/** Miniature phone showing the Veloura Home layout. */
export default function HomePreviewMock() {
  return (
    <View className="h-[300px] w-[160px] overflow-hidden rounded-[30px] border-[5px] border-white/15 bg-black shadow-2xl shadow-primary/40">
      <LinearGradient
        colors={['#4A0D35', '#1E0F33', '#08070C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <View className="absolute left-1/2 top-2 -ml-6 h-3 w-12 rounded-full bg-black/80" />

      <View className="px-3 pt-8">
        <Text className="font-medium text-[7px] text-primary-light">Good evening ✨</Text>
        <Text className="font-extrabold text-[30px] leading-[34px] tracking-[-1px] text-white">9:41</Text>
        <Text className="font-medium text-[7px] text-white/70">Wednesday, 7 October</Text>

        <View className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-2">
          <Text className="font-bold text-[7px] text-white">Veloura Studio</Text>
          <View className="mt-1.5 flex-row justify-between">
            <LinearGradient
              colors={['#FF8FD1', '#FF4FA3', '#A855F7']}
              className="h-6 w-6 items-center justify-center overflow-hidden rounded-full"
            >
              <MaterialCommunityIcons name="camera" className="text-[11px] text-white" />
            </LinearGradient>
            {(['image-edit-outline', 'view-grid-outline', 'creation'] as const).map((icon) => (
              <View key={icon} className="h-6 w-6 items-center justify-center rounded-full bg-black/40">
                <MaterialCommunityIcons name={icon} className="text-[11px] text-white/80" />
              </View>
            ))}
          </View>
        </View>

        <View className="mt-2 h-5 flex-row items-center rounded-full border border-white/15 bg-black/30 px-2">
          <MaterialCommunityIcons name="magnify" className="text-[9px] text-white/60" />
          <Text className="ml-1 font-medium text-[7px] text-white/50">Search apps</Text>
        </View>
      </View>

      <View className="absolute bottom-3 left-2 right-2 flex-row justify-around rounded-2xl border border-white/15 bg-white/10 py-2">
        {['bg-sky-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'].map((c) => (
          <View key={c} className={`h-5 w-5 rounded-lg ${c}`} />
        ))}
      </View>
    </View>
  );
}
