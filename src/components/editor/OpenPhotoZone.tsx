import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

import PressableScale from '../PressableScale';

/** Dashed drop-zone style entry for opening a photo. */
export default function OpenPhotoZone({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open a photo to edit"
      pressedScale={0.98}
      className="mx-5 items-center rounded-[30px] border-2 border-dashed border-primary-light/35 bg-primary/[0.06] px-6 pb-6 pt-7"
    >
      {/* Fanned thumbnails */}
      <View className="h-[92px] w-[170px] items-center justify-end">
        <Image
          source={require('../../../assets/images/sections/editor/fan-left.jpg')}
          className="absolute bottom-0 left-2 h-[78px] w-[62px] -rotate-12 rounded-xl border-2 border-white/80"
        />
        <Image
          source={require('../../../assets/images/sections/editor/fan-right.jpg')}
          className="absolute bottom-0 right-2 h-[78px] w-[62px] rotate-12 rounded-xl border-2 border-white/80"
        />
        <View className="h-[88px] w-[70px] items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-primary">
          <Image source={require('../../../assets/images/sections/editor/fan-center.jpg')} className="absolute inset-0 h-full w-full" />
          <View className="h-9 w-9 items-center justify-center rounded-full bg-black/50">
            <MaterialCommunityIcons name="plus" className="text-2xl text-white" />
          </View>
        </View>
      </View>
      <Text className="mt-5 font-extrabold text-lg text-white">Open a photo</Text>
      <Text className="mt-1 text-center font-regular text-xs text-content-secondary">
        Beauty, filters, crop & more — it never leaves your phone
      </Text>
    </PressableScale>
  );
}
