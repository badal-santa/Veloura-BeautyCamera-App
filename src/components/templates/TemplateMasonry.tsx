import { Text, View, useWindowDimensions } from 'react-native';

import type { Template } from '../../data/templates';
import PressableScale from '../PressableScale';
import TemplatePreview, { RATIO_HEIGHT } from './TemplatePreview';

const GAP = 12;
const SIDE = 20;

/** Two-column masonry of live template previews. */
export default function TemplateMasonry({ templates, onUse }: { templates: Template[]; onUse: (t: Template) => void }) {
  const { width } = useWindowDimensions();
  const colW = (width - SIDE * 2 - GAP) / 2;

  // Place each tile in the currently shorter column.
  const cols: Template[][] = [[], []];
  const heights = [0, 0];
  for (const t of templates) {
    const i = heights[0] <= heights[1] ? 0 : 1;
    cols[i].push(t);
    heights[i] += colW * RATIO_HEIGHT[t.ratio] + 52;
  }

  return (
    <View className="flex-row px-5" style={{ gap: GAP }}>
      {cols.map((col, ci) => (
        <View key={ci} style={{ width: colW, gap: GAP }}>
          {col.map((t) => (
            <PressableScale
              key={t.id}
              onPress={() => onUse(t)}
              accessibilityRole="button"
              accessibilityLabel={`${t.title}, ${t.description}, ${t.ratio}`}
            >
              <View className="overflow-hidden rounded-2xl border border-white/10" pointerEvents="none">
                <TemplatePreview template={t} width={colW} />
              </View>
              <View className="mt-2 flex-row items-center justify-between px-1">
                <Text className="flex-1 font-bold text-[13px] text-white" numberOfLines={1}>
                  {t.title}
                </Text>
                <Text className="ml-2 font-semibold text-[11px] text-white/40">{t.ratio}</Text>
              </View>
            </PressableScale>
          ))}
        </View>
      ))}
    </View>
  );
}
