import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

import PressableScale from '../PressableScale';

const greeting = (h: number) => (h < 5 ? 'Late-night glow' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');

export default function HomeGreeting({ onSettings }: { onSettings: () => void }) {
  return (
    <View className="px-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3">
          <Image source={require('../../../assets/images/logo.png')} className="h-7 w-7 rounded-full" />
          <Text className="ml-2 font-bold text-[13px] text-white">Veloura Studio</Text>
        </View>
        <PressableScale
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <MaterialCommunityIcons name="tune-variant" className="text-xl text-white" />
        </PressableScale>
      </View>
      <Text className="mt-6 font-medium text-sm text-primary-light">{greeting(new Date().getHours())} ✨</Text>
      <Text className="mt-1 font-extrabold text-[30px] leading-[36px] tracking-[-0.6px] text-white">
        What are we{'\n'}creating today?
      </Text>
    </View>
  );
}
