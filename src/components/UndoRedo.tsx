import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import PressableScale from './PressableScale';

type Props = {
  history: { undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean };
};

/** Compact undo/redo pill for editor headers. */
export default function UndoRedo({ history }: Props) {
  return (
    <View className="h-11 flex-row items-center rounded-full border border-white/15 bg-black/40 px-1">
      {(
        [
          ['undo', history.undo, history.canUndo, 'Undo'],
          ['redo', history.redo, history.canRedo, 'Redo'],
        ] as const
      ).map(([icon, onPress, enabled, label]) => (
        <PressableScale
          key={icon}
          onPress={onPress}
          disabled={!enabled}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: !enabled }}
          hitSlop={4}
          pressedScale={0.85}
          className="h-9 w-9 items-center justify-center rounded-full"
        >
          <MaterialCommunityIcons name={icon} className={`text-[20px] ${enabled ? 'text-white' : 'text-white/25'}`} />
        </PressableScale>
      ))}
    </View>
  );
}
