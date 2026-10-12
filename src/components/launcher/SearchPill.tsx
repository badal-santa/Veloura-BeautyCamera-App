import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

import PressableScale from '../PressableScale';

export default function SearchPill({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="search"
      accessibilityLabel="Search apps"
      pressedScale={0.98}
      className="mx-5 flex-row items-center rounded-full border border-white/15 bg-black/35 px-4 py-3.5"
    >
      <MaterialCommunityIcons name="magnify" className="text-xl text-white/70" />
      <Text className="ml-2.5 flex-1 font-medium text-[15px] text-white/60">Search apps</Text>
      <MaterialCommunityIcons name="star-four-points" className="text-sm text-primary-light" />
    </PressableScale>
  );
}
