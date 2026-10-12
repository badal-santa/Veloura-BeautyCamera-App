import { Pressable, ScrollView, Text, View } from 'react-native';

import { BACKGROUNDS, COLLAGE_RATIOS, type CollageLayout, type CollageRatio } from '../../features/collage/layouts';

export function LayoutPicker({
  layouts,
  value,
  onChange,
}: {
  layouts: CollageLayout[];
  value: string;
  onChange: (id: string) => void;
}) {
  const S = 52;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="items-center gap-3 px-5">
      {layouts.map((l) => {
        const on = l.id === value;
        return (
          <Pressable
            key={l.id}
            onPress={() => onChange(l.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`Layout ${l.id}`}
            className={`rounded-2xl border-2 p-1.5 ${on ? 'border-primary bg-primary/15' : 'border-white/10 bg-white/5'}`}
          >
            <View style={{ width: S, height: S }}>
              {l.cells.map((c, i) => (
                <View
                  key={i}
                  className={`absolute rounded-[4px] ${on ? 'bg-primary-light' : 'bg-white/40'}`}
                  style={{ left: c.x * S + 1.5, top: c.y * S + 1.5, width: c.width * S - 3, height: c.height * S - 3 }}
                />
              ))}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function Chips<T extends string | number>({
  label,
  options,
  value,
  format,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  format: (v: T) => string;
  onChange: (v: T) => void;
}) {
  return (
    <View className="flex-row items-center">
      <Text className="w-[72px] font-semibold text-[13px] text-white/70">{label}</Text>
      <View className="flex-1 flex-row gap-1.5">
        {options.map((o) => {
          const on = o === value;
          return (
            <Pressable
              key={String(o)}
              onPress={() => onChange(o)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              className={`flex-1 items-center rounded-xl border py-1.5 ${on ? 'border-primary bg-primary/20' : 'border-white/10 bg-black/20'}`}
            >
              <Text className={`font-semibold text-xs ${on ? 'text-primary-light' : 'text-white/60'}`}>{format(o)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function StylePanel({
  ratio,
  gap,
  radius,
  background,
  onChange,
}: {
  ratio: CollageRatio;
  gap: number;
  radius: number;
  background: string;
  onChange: (patch: { ratio?: CollageRatio; gap?: number; radius?: number; background?: string }) => void;
}) {
  return (
    <View className="gap-2.5 px-5">
      <Chips label="Ratio" options={Object.keys(COLLAGE_RATIOS) as CollageRatio[]} value={ratio} format={(v) => v} onChange={(v) => onChange({ ratio: v })} />
      <Chips label="Spacing" options={[0, 6, 12, 20] as const} value={gap as 0} format={(v) => (v === 0 ? 'None' : `${v}`)} onChange={(v) => onChange({ gap: v })} />
      <Chips label="Corners" options={[0, 8, 16, 28] as const} value={radius as 0} format={(v) => (v === 0 ? 'Sharp' : `${v}`)} onChange={(v) => onChange({ radius: v })} />
      <View className="flex-row items-center">
        <Text className="w-[72px] font-semibold text-[13px] text-white/70">Color</Text>
        <View className="flex-1 flex-row justify-between">
          {BACKGROUNDS.map((c) => (
            <Pressable
              key={c}
              onPress={() => onChange({ background: c })}
              accessibilityRole="radio"
              accessibilityState={{ selected: c === background }}
              accessibilityLabel={`Background ${c}`}
              className={`h-7 w-7 rounded-full border-2 ${c === background ? 'border-primary' : 'border-white/15'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
