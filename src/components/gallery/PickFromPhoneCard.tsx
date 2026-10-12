import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import PressableScale from '../PressableScale';

export default function PickFromPhoneCard({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Choose a photo from your phone"
      pressedScale={0.98}
      className="mx-5 flex-row items-center overflow-hidden rounded-[28px] border border-primary-light/30 bg-surface p-5"
    >
      <LinearGradient
        colors={['rgba(255, 79, 163, 0.30)', 'rgba(168, 85, 247, 0.18)', 'rgba(8, 7, 12, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <LinearGradient
        colors={['#FF8FD1', '#FF4FA3', '#A855F7']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/25"
      >
        <View className="absolute inset-x-[4px] top-[2px] h-1/2 rounded-full bg-white/25" />
        <MaterialCommunityIcons name="image-plus-outline" className="text-[26px] text-white" />
      </LinearGradient>
      <View className="ml-4 flex-1">
        <Text className="font-bold text-[17px] text-content-primary">Choose from your phone</Text>
        <Text className="mt-1 font-regular text-xs text-content-secondary">
          Open any photo in the editor — nothing is uploaded.
        </Text>
      </View>
      <View className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-white/10">
        <MaterialCommunityIcons name="arrow-right" className="text-lg text-primary-light" />
      </View>
    </PressableScale>
  );
}
