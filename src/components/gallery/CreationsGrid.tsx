import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

import PressableScale from '../PressableScale';

type Props = {
  uris: string[];
  onOpen: (uri: string) => void;
  onDelete: (uri: string) => void;
  onEmptyAction: () => void;
};

export default function CreationsGrid({ uris, onOpen, onDelete, onEmptyAction }: Props) {
  if (uris.length === 0) {
    return (
      <View className="mx-5 items-center rounded-[24px] border border-dashed border-white/15 bg-surface/60 px-6 py-10">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/15">
          <MaterialCommunityIcons name="image-multiple-outline" className="text-[28px] text-primary-light" />
        </View>
        <Text className="mt-4 font-bold text-base text-content-primary">No creations yet</Text>
        <Text className="mt-1 text-center font-regular text-xs text-content-secondary">
          Photos you save from Veloura will appear here.
        </Text>
        <PressableScale
          onPress={onEmptyAction}
          accessibilityRole="button"
          className="mt-5 flex-row items-center rounded-full bg-primary px-4 py-2.5"
        >
          <MaterialCommunityIcons name="camera" className="text-base text-white" />
          <Text className="ml-1.5 font-bold text-[13px] text-white">Take a photo</Text>
        </PressableScale>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2 px-5">
      {uris.map((uri) => (
        <PressableScale
          key={uri}
          onPress={() => onOpen(uri)}
          onLongPress={() => onDelete(uri)}
          delayLongPress={400}
          accessibilityRole="imagebutton"
          accessibilityLabel="Your creation"
          accessibilityHint="Opens in the editor. Long press to delete."
          className="aspect-square w-[32%] overflow-hidden rounded-[18px] border border-white/10 bg-surface"
        >
          <Image source={{ uri }} className="h-full w-full" resizeMode="cover" />
        </PressableScale>
      ))}
    </View>
  );
}
