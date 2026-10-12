import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useImage } from '@shopify/react-native-skia';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';

import RoundIconButton from '../components/camera/RoundIconButton';
import CanvasLayer from '../components/decorate/CanvasLayer';
import { StickerPanel, TextPanel, WatermarkPanel } from '../components/decorate/DecoratePanels';
import WatermarkMark from '../components/decorate/WatermarkMark';
import UndoRedo from '../components/UndoRedo';
import GradientButton from '../components/GradientButton';
import PressableScale from '../components/PressableScale';
import { FULL_RECT, fitRect } from '../features/beauty/crop';
import { exportEditedImage } from '../features/beauty/exportImage';
import { prepareImage } from '../features/beauty/prepareImage';
import { NEUTRAL_EDIT } from '../features/beauty/types';
import { DEFAULT_WATERMARK, newLayerId, type Layer, type TextStyle, type Watermark } from '../features/decorate/types';
import { saveCreation } from '../features/media/creations';
import { settingsStore } from '../features/settings/settings';
import { exportTemplate } from '../features/templates/exportTemplate';
import { useHistory } from '../lib/useHistory';
import type { RootStackScreenProps } from '../navigation/types';

type Tool = 'sticker' | 'text' | 'watermark';

const TOOLS: { id: Tool; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { id: 'sticker', label: 'Stickers', icon: 'sticker-emoji' },
  { id: 'text', label: 'Text', icon: 'format-text' },
  { id: 'watermark', label: 'Watermark', icon: 'watermark' },
];

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

export default function DecorateScreen({ navigation, route }: RootStackScreenProps<'Decorate'>) {
  const { uri, rotation = 0, tool: initialTool = 'sticker' } = route.params;
  const source = useImage(uri);

  // Upright, preview-sized copy of the photo.
  const photo = useMemo(() => {
    if (!source) return null;
    const image = prepareImage(source, rotation);
    const edge = 1600;
    const s = Math.min(1, edge / Math.max(image.width(), image.height()));
    return {
      uri: exportEditedImage(image, NEUTRAL_EDIT, FULL_RECT, edge),
      width: image.width() * s,
      height: image.height() * s,
    };
  }, [source, rotation]);

  const [tool, setTool] = useState<Tool>(initialTool);
  // Layers + watermark are one undoable document.
  const history = useHistory<{ layers: Layer[]; watermark: Watermark }>({
    layers: [],
    watermark: { ...DEFAULT_WATERMARK, enabled: initialTool === 'watermark' },
  });
  const { layers, watermark } = history.state;
  const setLayers = (fn: (ls: Layer[]) => Layer[], group?: string) =>
    history.set((d) => ({ ...d, layers: fn(d.layers) }), group);
  const setWatermark = (fn: (w: Watermark) => Watermark, group?: string) =>
    history.set((d) => ({ ...d, watermark: fn(d.watermark) }), group);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [working, setWorking] = useState<'save' | 'share' | null>(null);
  const [saved, setSaved] = useState(false);
  const [, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true, granularPermissions: ['photo'] });
  const canvas = useRef<View>(null);

  const size = photo && area.width > 0 ? fitRect(photo.width, photo.height, area.width, area.height) : null;
  const selected = layers.find((l) => l.id === selectedId) ?? null;

  const addLayer = (layer: Omit<Layer, 'id' | 'x' | 'y' | 'scale' | 'rotation'>) => {
    const id = newLayerId();
    // Stagger new items a little so they don't stack exactly.
    const n = layers.length % 5;
    setLayers((ls) => [...ls, { ...layer, id, x: 0.5 + (n - 2) * 0.04, y: 0.45 + (n - 2) * 0.04, scale: 1, rotation: 0 }]);
    setSelectedId(id);
  };

  // Typing merges into one undo step per layer; gestures are one step each.
  const updateLayer = (id: string, patch: Partial<Layer>) =>
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)), 'content' in patch ? `text.${id}` : undefined);

  const snapshot = async () => {
    setSelectedId(null);
    await nextFrame();
    return exportTemplate(canvas);
  };

  const save = async () => {
    setWorking('save');
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow photo access to save your design.');
        return;
      }
      const out = await snapshot();
      await MediaLibrary.Asset.create(out);
      if (settingsStore.get().saveCreations) await saveCreation(out);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : String(e));
    } finally {
      setWorking(null);
    }
  };

  const share = async () => {
    setWorking('share');
    try {
      await Sharing.shareAsync(await snapshot(), { mimeType: 'image/jpeg', dialogTitle: 'Share your photo' });
    } catch (e) {
      Alert.alert('Could not share', e instanceof Error ? e.message : String(e));
    } finally {
      setWorking(null);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-black">
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-5 pt-safe-offset-2">
        <RoundIconButton icon="arrow-left" label="Back" onPress={() => navigation.goBack()} />
        <Text className="font-bold text-base text-white">Decorate</Text>
        <View className="flex-row gap-2">
          <UndoRedo history={history} />
          <RoundIconButton icon="share-variant" label="Share" onPress={share} />
        </View>
      </View>

      {/* Tapping empty space deselects. */}
      <Pressable
        className="my-3 flex-1 items-center justify-center"
        onPress={() => setSelectedId(null)}
        onLayout={(e) => setArea({ width: e.nativeEvent.layout.width - 24, height: e.nativeEvent.layout.height })}
      >
        {size && photo ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <View ref={canvas} collapsable={false} className="overflow-hidden" style={{ width: size.width, height: size.height }}>
              <Image source={{ uri: photo.uri }} className="absolute inset-0 h-full w-full" />
              {layers.map((layer) => (
                <CanvasLayer
                  key={layer.id}
                  layer={layer}
                  canvasWidth={size.width}
                  canvasHeight={size.height}
                  selected={layer.id === selectedId}
                  onSelect={setSelectedId}
                  onChange={updateLayer}
                  onDelete={(id) => {
                    setLayers((ls) => ls.filter((l) => l.id !== id));
                    setSelectedId(null);
                  }}
                />
              ))}
              <WatermarkMark watermark={watermark} canvasWidth={size.width} />
            </View>
          </Animated.View>
        ) : (
          <ActivityIndicator color="#FF4FA3" />
        )}
      </Pressable>

      <View className="rounded-t-[32px] border-t border-white/10 bg-surface/90 pb-safe-offset-4 pt-4">
        <View className="min-h-[104px] justify-center">
          {tool === 'sticker' && (
            <StickerPanel onAdd={(glyph) => addLayer({ kind: 'sticker', content: glyph, color: '#FFFFFF', textStyle: 'plain' })} />
          )}
          {tool === 'text' && (
            <TextPanel
              selected={selected?.kind === 'text' ? selected : null}
              onAdd={(text, color, textStyle: TextStyle) => addLayer({ kind: 'text', content: text, color, textStyle })}
              onEdit={(patch) => selected && updateLayer(selected.id, patch)}
            />
          )}
          {tool === 'watermark' && (
            <WatermarkPanel
              watermark={watermark}
              onChange={(patch) => setWatermark((w) => ({ ...w, ...patch }), 'text' in patch ? 'watermark.text' : undefined)}
            />
          )}
        </View>

        <View className="mx-5 mt-3 flex-row rounded-full border border-white/10 bg-white/5 p-1">
          {TOOLS.map((t) => {
            const on = t.id === tool;
            return (
              <PressableScale
                key={t.id}
                onPress={() => setTool(t.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                className={`flex-1 flex-row items-center justify-center rounded-full py-2 ${on ? 'bg-primary/20' : ''}`}
              >
                <MaterialCommunityIcons name={t.icon} className={`text-base ${on ? 'text-primary-light' : 'text-white/60'}`} />
                <Text className={`ml-1.5 font-semibold text-[13px] ${on ? 'text-primary-light' : 'text-white/70'}`}>{t.label}</Text>
              </PressableScale>
            );
          })}
        </View>

        <View className="mt-4 px-5">
          {working ? (
            <View className="h-[58px] items-center justify-center">
              <ActivityIndicator color="#FF4FA3" />
            </View>
          ) : (
            <GradientButton label="Save to gallery" icon="download" onPress={save} />
          )}
        </View>
      </View>

      {saved && (
        <Animated.View
          entering={FadeInUp.duration(250)}
          exiting={FadeOutUp.duration(250)}
          className="absolute left-0 right-0 items-center pt-safe-offset-16"
          pointerEvents="none"
        >
          <View className="flex-row items-center rounded-full border border-emerald-400/40 bg-surface px-4 py-2.5">
            <MaterialCommunityIcons name="check-circle" className="text-lg text-emerald-400" />
            <Text className="ml-2 font-semibold text-sm text-white">Saved to gallery</Text>
          </View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}
