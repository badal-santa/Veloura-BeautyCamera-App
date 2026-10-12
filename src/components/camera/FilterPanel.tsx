import { Canvas, ColorMatrix, Image as SkiaImage, type SkImage } from '@shopify/react-native-skia';
import { ScrollView, Text, View } from 'react-native';

import { filterMatrix } from '../../features/beauty/colorMatrix';
import { FILTERS, type FilterId } from '../../features/beauty/types';
import PressableScale from '../PressableScale';

const THUMB = 64;

type Props = {
  selected: FilterId;
  onSelect: (filter: FilterId) => void;
  /** Image rendered through each filter for the thumbnails. */
  sample: SkImage | null;
};

export default function FilterPanel({ selected, onSelect, sample }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 px-4">
      {FILTERS.map((f) => {
        const active = f.id === selected;
        return (
          <PressableScale
            key={f.id}
            onPress={() => onSelect(f.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${f.name} filter`}
            className="items-center"
          >
            <View
              className={`h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-[20px] border-2 ${
                active ? 'border-primary' : 'border-transparent'
              }`}
            >
              <View className="h-16 w-16 overflow-hidden rounded-[17px] bg-white/10">
                {sample && (
                  <Canvas className="h-16 w-16">
                    <SkiaImage image={sample} x={0} y={0} width={THUMB} height={THUMB} fit="cover">
                      <ColorMatrix matrix={filterMatrix(f.id)} />
                    </SkiaImage>
                  </Canvas>
                )}
              </View>
            </View>
            <Text className={`mt-1.5 font-semibold text-xs ${active ? 'text-primary-light' : 'text-white/70'}`}>
              {f.name}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
