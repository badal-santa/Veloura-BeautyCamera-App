import { Text, View } from 'react-native';

/** "Ad" label — every ad must carry one so it can't be mistaken for content. */
export default function AdBadge({ className = '' }: { className?: string }) {
  return (
    <View className={`rounded-md border border-premium/50 bg-premium/15 px-1.5 py-0.5 ${className}`}>
      <Text className="font-bold text-[9px] tracking-[1px] text-premium">AD</Text>
    </View>
  );
}
