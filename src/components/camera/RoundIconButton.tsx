import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

import PressableScale from '../PressableScale';

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
  /** Small text shown beside the icon, e.g. "3s". */
  badge?: string;
  active?: boolean;
  size?: 'md' | 'lg';
};

export default function RoundIconButton({ icon, label, onPress, badge, active, size = 'md' }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      pressedScale={0.9}
      className={`flex-row items-center justify-center rounded-full border ${
        active ? 'border-primary-light/50 bg-primary/25' : 'border-white/15 bg-black/40'
      } ${size === 'lg' ? 'h-14 w-14' : badge ? 'h-11 px-3' : 'h-11 w-11'}`}
    >
      <MaterialCommunityIcons
        name={icon}
        className={`${size === 'lg' ? 'text-[26px]' : 'text-[21px]'} ${active ? 'text-primary-light' : 'text-white'}`}
      />
      {badge && <Text className="ml-1 font-bold text-xs text-white">{badge}</Text>}
    </PressableScale>
  );
}
