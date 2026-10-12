import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  /** Optional trailing link, e.g. "See all". */
  action?: { label: string; onPress?: () => void };
};

export default function SectionTitle({ title, action }: Props) {
  return (
    <View className="mb-3 mt-8 flex-row items-center justify-between px-5">
      <Text className="font-bold text-lg text-content-primary">{title}</Text>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={10} accessibilityRole="button">
          <Text className="font-semibold text-[13px] text-primary-light">{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}
