import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

import type { Look } from '../../data/looks';
import PressableScale from '../PressableScale';

/** 2×2 grid of square look tiles. */
export default function LookGrid({ looks, onPress }: { looks: Look[]; onPress: (look: Look) => void }) {
  return (
    <View className="mx-5 flex-row flex-wrap justify-between gap-y-3">
      {looks.map((look) => (
        <PressableScale
          key={look.name}
          onPress={() => onPress(look)}
          accessibilityRole="button"
          accessibilityLabel={`${look.name} look, ${look.mood}`}
          className="aspect-square w-[48.5%] overflow-hidden rounded-[24px]"
        >
          <Image source={look.image} className="absolute inset-0 h-full w-full" resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(8, 7, 12, 0.85)']} locations={[0.5, 1]} className="absolute inset-0" />
          <View className="mt-auto p-3.5">
            <Text className="font-extrabold text-base text-white">{look.name}</Text>
            <Text className="font-regular text-[11px] text-white/70">{look.mood}</Text>
          </View>
        </PressableScale>
      ))}
    </View>
  );
}
