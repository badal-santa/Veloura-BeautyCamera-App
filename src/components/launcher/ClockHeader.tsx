import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

function useNow(intervalMs = 10_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const greeting = (hour: number) =>
  hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

export default function ClockHeader() {
  const now = useNow();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const period = now.getHours() < 12 ? 'AM' : 'PM';
  const date = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View className="px-6">
      <Text className="font-medium text-sm text-primary-light">{greeting(now.getHours())} ✨</Text>
      <View className="mt-1 flex-row items-end">
        <Text className="font-extrabold text-[78px] leading-[86px] tracking-[-3px] text-white">
          {hours}:{minutes}
        </Text>
        <Text className="mb-4 ml-2 font-semibold text-lg text-white/60">{period}</Text>
      </View>
      <Text className="font-medium text-base text-white/75">{date}</Text>
    </View>
  );
}
