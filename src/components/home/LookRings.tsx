import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, View } from 'react-native';

import type { Look } from '../../data/looks';
import PressableScale from '../PressableScale';

/** Story-style circular look previews with a gradient ring. */
export default function LookRings({ looks, onPress }: { looks: Look[]; onPress: (look: Look) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 px-5">
      {looks.map((look) => (
        <PressableScale
          key={look.name}
          onPress={() => onPress(look)}
          accessibilityRole="button"
          accessibilityLabel={`${look.name} look, ${look.mood}`}
          className="items-center"
        >
          <LinearGradient
            colors={['#FFB38A', '#FF4FA3', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-[78px] w-[78px] items-center justify-center rounded-full"
          >
            <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-background">
              <Image source={look.image} className="h-[66px] w-[66px] rounded-full" />
            </View>
          </LinearGradient>
          <Text className="mt-1.5 font-semibold text-xs text-white">{look.name}</Text>
          <Text className="font-regular text-[10px] text-white/50">{look.mood}</Text>
        </PressableScale>
      ))}
    </ScrollView>
  );
}
