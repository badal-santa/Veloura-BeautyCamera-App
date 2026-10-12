import { Pressable, ScrollView, Text, View } from 'react-native';

export default function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-6 px-5">
      {tabs.map((t) => {
        const on = t === value;
        return (
          <Pressable key={t} onPress={() => onChange(t)} accessibilityRole="tab" accessibilityState={{ selected: on }} hitSlop={8}>
            <Text className={`font-bold text-base ${on ? 'text-white' : 'text-white/40'}`}>{t}</Text>
            <View className={`mt-1.5 h-[3px] rounded-full ${on ? 'bg-primary' : 'bg-transparent'}`} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
