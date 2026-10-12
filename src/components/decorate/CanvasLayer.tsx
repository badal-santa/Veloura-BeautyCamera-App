import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Layer } from '../../features/decorate/types';
import PressableScale from '../PressableScale';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  layer: Layer;
  canvasWidth: number;
  canvasHeight: number;
  selected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<Layer>) => void;
  onDelete: (id: string) => void;
};

/** One sticker or text on the canvas: drag, pinch to resize, twist to rotate. */
export default function CanvasLayer({ layer, canvasWidth: W, canvasHeight: H, selected, onSelect, onChange, onDelete }: Props) {
  const x = useSharedValue(layer.x * W);
  const y = useSharedValue(layer.y * H);
  const scale = useSharedValue(layer.scale);
  const rotation = useSharedValue(layer.rotation);
  const size = useSharedValue({ w: 0, h: 0 });

  // Follow external changes (undo / redo).
  useEffect(() => {
    x.set(layer.x * W);
    y.set(layer.y * H);
    scale.set(layer.scale);
    rotation.set(layer.rotation);
  }, [layer.x, layer.y, layer.scale, layer.rotation, W, H, x, y, scale, rotation]);

  const commit = () =>
    onChange(layer.id, { x: x.get() / W, y: y.get() / H, scale: scale.get(), rotation: rotation.get() });

  const select = () => onSelect(layer.id);

  const pan = Gesture.Pan()
    .onBegin(() => scheduleOnRN(select))
    .onChange((e) => {
      x.set(Math.min(W, Math.max(0, x.get() + e.changeX)));
      y.set(Math.min(H, Math.max(0, y.get() + e.changeY)));
    })
    .onFinalize(() => scheduleOnRN(commit));
  const pinch = Gesture.Pinch()
    .onChange((e) => scale.set(Math.min(6, Math.max(0.3, scale.get() * e.scaleChange))))
    .onFinalize(() => scheduleOnRN(commit));
  const rotate = Gesture.Rotation()
    .onChange((e) => rotation.set(rotation.get() + e.rotationChange))
    .onFinalize(() => scheduleOnRN(commit));
  const gesture = Gesture.Simultaneous(pan, pinch, rotate);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() - size.get().w / 2 },
      { translateY: y.get() - size.get().h / 2 },
      { rotate: `${rotation.get()}rad` },
      { scale: scale.get() },
    ],
  }));

  // Sizes scale with the canvas so the export matches the screen.
  const base = W * (layer.kind === 'sticker' ? 0.16 : 0.075);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className="absolute left-0 top-0"
        style={style}
        onLayout={(e) => size.set({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <View className={`p-1.5 ${selected ? 'rounded-xl border-2 border-dashed border-white/90' : 'border-2 border-transparent'}`}>
          {layer.kind === 'sticker' ? (
            <Text style={{ fontSize: base, lineHeight: base * 1.2 }}>{layer.content}</Text>
          ) : (
            <LayerText layer={layer} fontSize={base} />
          )}
        </View>
        {selected && (
          <PressableScale
            onPress={() => onDelete(layer.id)}
            accessibilityRole="button"
            accessibilityLabel="Delete"
            hitSlop={10}
            className="absolute -right-3 -top-3 h-7 w-7 items-center justify-center rounded-full bg-rose-500"
          >
            <MaterialCommunityIcons name="close" className="text-base text-white" />
          </PressableScale>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

function LayerText({ layer, fontSize }: { layer: Layer; fontSize: number }) {
  const common = { fontSize, lineHeight: fontSize * 1.2 };
  if (layer.textStyle === 'pill') {
    const dark = layer.color === '#111111' || layer.color === '#FFFFFF';
    return (
      <View className="rounded-full px-4 py-1.5" style={{ backgroundColor: layer.color }}>
        <Text className={`font-extrabold ${dark && layer.color === '#FFFFFF' ? 'text-black' : 'text-white'}`} style={common}>
          {layer.content}
        </Text>
      </View>
    );
  }
  return (
    <Text
      className="font-extrabold"
      style={{
        ...common,
        color: layer.color,
        textShadowColor: layer.textStyle === 'neon' ? layer.color : 'rgba(0, 0, 0, 0.45)',
        textShadowRadius: layer.textStyle === 'neon' ? fontSize * 0.5 : 6,
        textShadowOffset: { width: 0, height: layer.textStyle === 'neon' ? 0 : 2 },
      }}
    >
      {layer.content}
    </Text>
  );
}
