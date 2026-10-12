import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { STICKERS, TEXT_COLORS, type Corner, type Layer, type TextStyle, type Watermark } from '../../features/decorate/types';
import PressableScale from '../PressableScale';

export function StickerPanel({ onAdd }: { onAdd: (glyph: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4">
      <View className="flex-row flex-wrap gap-1.5" style={{ width: Math.ceil(STICKERS.length / 2) * 54 }}>
        {STICKERS.map((s) => (
          <PressableScale
            key={s}
            onPress={() => onAdd(s)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${s} sticker`}
            pressedScale={0.85}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]"
          >
            <Text className="text-[26px]">{s}</Text>
          </PressableScale>
        ))}
      </View>
    </ScrollView>
  );
}

const STYLES: { id: TextStyle; label: string }[] = [
  { id: 'plain', label: 'Plain' },
  { id: 'pill', label: 'Pill' },
  { id: 'neon', label: 'Neon' },
];

export function TextPanel({
  selected,
  onAdd,
  onEdit,
}: {
  /** The selected text layer, if any — edits apply to it. */
  selected: Layer | null;
  onAdd: (text: string, color: string, style: TextStyle) => void;
  onEdit: (patch: Partial<Layer>) => void;
}) {
  const [draft, setDraft] = useState('');
  const [color, setColor] = useState(TEXT_COLORS[0]);
  const [style, setStyle] = useState<TextStyle>('plain');
  const activeColor = selected?.color ?? color;
  const activeStyle = selected?.textStyle ?? style;

  return (
    <View className="px-5">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center rounded-2xl border border-white/15 bg-white/5 px-3">
          <TextInput
            value={selected ? selected.content : draft}
            onChangeText={(t) => (selected ? onEdit({ content: t }) : setDraft(t))}
            placeholder="Type something…"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            maxLength={40}
            className="flex-1 py-3 font-medium text-[15px] text-white"
          />
        </View>
        {!selected && (
          <PressableScale
            onPress={() => {
              if (!draft.trim()) return;
              onAdd(draft.trim(), color, style);
              setDraft('');
            }}
            accessibilityRole="button"
            accessibilityLabel="Add text"
            className={`h-12 w-12 items-center justify-center rounded-2xl ${draft.trim() ? 'bg-primary' : 'bg-white/10'}`}
          >
            <MaterialCommunityIcons name="plus" className="text-2xl text-white" />
          </PressableScale>
        )}
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row gap-1.5">
          {STYLES.map((s) => {
            const on = s.id === activeStyle;
            return (
              <Pressable
                key={s.id}
                onPress={() => (selected ? onEdit({ textStyle: s.id }) : setStyle(s.id))}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                className={`rounded-full border px-3 py-1.5 ${on ? 'border-primary bg-primary/20' : 'border-white/10'}`}
              >
                <Text className={`font-semibold text-xs ${on ? 'text-primary-light' : 'text-white/70'}`}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View className="flex-row gap-1.5">
          {TEXT_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => (selected ? onEdit({ color: c }) : setColor(c))}
              accessibilityRole="radio"
              accessibilityState={{ selected: c === activeColor }}
              accessibilityLabel={`Color ${c}`}
              className={`h-6 w-6 rounded-full border-2 ${c === activeColor ? 'border-white' : 'border-white/15'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const CORNERS: { id: Corner; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { id: 'tl', icon: 'arrow-top-left' },
  { id: 'tr', icon: 'arrow-top-right' },
  { id: 'bl', icon: 'arrow-bottom-left' },
  { id: 'br', icon: 'arrow-bottom-right' },
];

export function WatermarkPanel({ watermark, onChange }: { watermark: Watermark; onChange: (patch: Partial<Watermark>) => void }) {
  return (
    <View className="px-5">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => onChange({ enabled: !watermark.enabled })}
          accessibilityRole="switch"
          accessibilityState={{ checked: watermark.enabled }}
          accessibilityLabel="Show watermark"
          className={`h-[28px] w-[48px] justify-center rounded-full px-[3px] ${watermark.enabled ? 'items-end bg-primary' : 'items-start bg-white/15'}`}
        >
          <View className="h-[22px] w-[22px] rounded-full bg-white" />
        </Pressable>
        <View className="flex-1 flex-row items-center rounded-2xl border border-white/15 bg-white/5 px-3">
          <Text className="font-bold text-white/60">✦</Text>
          <TextInput
            value={watermark.text}
            onChangeText={(t) => onChange({ text: t, enabled: true })}
            maxLength={24}
            placeholder="@yourname"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            className="ml-2 flex-1 py-2.5 font-medium text-[15px] text-white"
          />
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row gap-1.5">
          {CORNERS.map((c) => {
            const on = c.id === watermark.corner;
            return (
              <Pressable
                key={c.id}
                onPress={() => onChange({ corner: c.id, enabled: true })}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                className={`h-9 w-9 items-center justify-center rounded-xl border ${on ? 'border-primary bg-primary/20' : 'border-white/10'}`}
              >
                <MaterialCommunityIcons name={c.icon} className={`text-base ${on ? 'text-primary-light' : 'text-white/60'}`} />
              </Pressable>
            );
          })}
        </View>
        <View className="flex-row gap-1.5">
          {[0.4, 0.6, 0.8, 1].map((o) => {
            const on = Math.abs(o - watermark.opacity) < 0.01;
            return (
              <Pressable
                key={o}
                onPress={() => onChange({ opacity: o, enabled: true })}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                className={`rounded-full border px-2.5 py-1.5 ${on ? 'border-primary bg-primary/20' : 'border-white/10'}`}
              >
                <Text className={`font-semibold text-[11px] ${on ? 'text-primary-light' : 'text-white/60'}`}>{Math.round(o * 100)}%</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
