import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { listCreations } from '../features/media/creations';
import PressableScale from './PressableScale';

type Props = {
  title?: string;
  limit?: number;
  onOpen: (uri: string) => void;
  onSeeAll: () => void;
  /** Rendered when there are no creations (null hides the section). */
  empty?: React.ReactNode;
};

/** Horizontal strip of the latest photos saved from Veloura. */
export default function RecentCreations({ title = 'Recent creations', limit = 8, onOpen, onSeeAll, empty = null }: Props) {
  const [uris, setUris] = useState<string[]>([]);
  useFocusEffect(
    useCallback(() => {
      setUris(listCreations().slice(0, limit));
    }, [limit]),
  );

  if (uris.length === 0) return <>{empty}</>;

  return (
    <View>
      <View className="mb-3 mt-8 flex-row items-center justify-between px-5">
        <Text className="font-bold text-lg text-content-primary">{title}</Text>
        <Pressable onPress={onSeeAll} hitSlop={10} accessibilityRole="button">
          <Text className="font-semibold text-[13px] text-primary-light">See all</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5 px-5">
        {uris.map((uri) => (
          <PressableScale
            key={uri}
            onPress={() => onOpen(uri)}
            accessibilityRole="imagebutton"
            accessibilityLabel="Open creation"
            className="h-[104px] w-[84px] overflow-hidden rounded-2xl border border-white/10 bg-surface"
          >
            <Image source={{ uri }} className="h-full w-full" resizeMode="cover" />
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}
