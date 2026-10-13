import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';

import RoundIconButton from '../components/camera/RoundIconButton';
import CollageCanvas from '../components/collage/CollageCanvas';
import { LayoutPicker, StylePanel } from '../components/collage/CollagePanels';
import GlowBackdrop from '../components/GlowBackdrop';
import GradientButton from '../components/GradientButton';
import PressableScale from '../components/PressableScale';
import type { Pan } from '../components/templates/PhotoSlot';
import { maybeShowInterstitial } from '../features/ads/ads';
import { fitRect } from '../features/beauty/crop';
import { cellRect, COLLAGE_RATIOS, LAYOUTS, type CollageRatio } from '../features/collage/layouts';
import { saveCreation } from '../features/media/creations';
import { pickPhotos, type PickedImage } from '../features/media/pickPhotos';
import { settingsStore } from '../features/settings/settings';
import { exportTemplate } from '../features/templates/exportTemplate';
import { useFrozenSlots } from '../features/templates/freezeSlots';
import type { RootStackScreenProps } from '../navigation/types';

type Tab = 'layout' | 'style';

export default function CollageScreen({ navigation, route }: RootStackScreenProps<'Collage'>) {
  const [photos, setPhotos] = useState<PickedImage[]>([]);
  const [layoutId, setLayoutId] = useState('2-cols');
  const [pans, setPans] = useState<Pan[]>([]);
  const [style, setStyle] = useState({ ratio: '4:5' as CollageRatio, gap: 12, radius: 16, background: '#FFFFFF' });
  const [tab, setTab] = useState<Tab>('layout');
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [working, setWorking] = useState<'save' | 'share' | null>(null);
  const [saved, setSaved] = useState(false);
  const [, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true, granularPermissions: ['photo'] });
  const canvas = useRef<View>(null);
  const { frozen, onFrozenLoad, withFrozen } = useFrozenSlots();

  const layouts = LAYOUTS[Math.max(1, photos.length)] ?? LAYOUTS[2];
  const layout = layouts.find((l) => l.id === layoutId) ?? layouts[0];
  const size = area.width > 0 ? fitRect(1, COLLAGE_RATIOS[style.ratio], area.width, area.height) : null;

  const applyPhotos = (picked: PickedImage[]) => {
    setPhotos(picked);
    setPans(picked.map(() => ({ x: 0, y: 0 })));
    setLayoutId(LAYOUTS[picked.length][0].id);
  };

  const choose = async () => {
    try {
      const picked = await pickPhotos(4);
      if (picked.length === 0) return;
      if (picked.length === 1) {
        Alert.alert('Pick at least 2 photos', 'A collage needs 2 to 4 photos.');
        return;
      }
      applyPhotos(picked);
    } catch (e) {
      Alert.alert('Could not open photos', e instanceof Error ? e.message : String(e));
    }
  };

  // Opened with photos (e.g. veloura://collage?uris=…).
  const initialUris = route.params?.uris;
  useEffect(() => {
    if (!initialUris || initialUris.length < 2) return;
    const list = initialUris.slice(0, 4);
    Promise.all(
      list.map(
        (uri) =>
          new Promise<PickedImage>((resolve, reject) =>
            Image.getSize(uri, (width, height) => resolve({ uri, width, height }), reject),
          ),
      ),
    )
      .then(applyPhotos)
      .catch(() => Alert.alert('Could not open photos'));
  }, [initialUris]);

  // Snapshot with each cell pre-cropped (view snapshots ignore clipping).
  const snapshot = () => {
    if (!size) throw new Error('Collage not ready');
    const slots = layout.cells.slice(0, photos.length).map((cell, i) => ({
      uri: photos[i].uri,
      imageWidth: photos[i].width,
      imageHeight: photos[i].height,
      rect: cellRect(cell, size.width, size.height, style.gap),
      zoom: 1,
      pan: pans[i] ?? { x: 0, y: 0 },
    }));
    return withFrozen(slots, () => exportTemplate(canvas));
  };

  const save = async () => {
    setWorking('save');
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow photo access to save your collage.');
        return;
      }
      const out = await snapshot();
      await MediaLibrary.Asset.create(out);
      if (settingsStore.get().saveCreations) await saveCreation(out);
      setSaved(true);
      maybeShowInterstitial();
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
      await Sharing.shareAsync(await snapshot(), { mimeType: 'image/jpeg', dialogTitle: 'Share your collage' });
    } catch (e) {
      Alert.alert('Could not share', e instanceof Error ? e.message : String(e));
    } finally {
      setWorking(null);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(52, 211, 153, 0.14)" />

      <View className="flex-row items-center justify-between px-5 pt-safe-offset-2">
        <RoundIconButton icon="arrow-left" label="Back" onPress={() => navigation.goBack()} />
        <Text className="font-bold text-base text-white">Collage</Text>
        {photos.length > 0 ? <RoundIconButton icon="share-variant" label="Share" onPress={share} /> : <View className="h-11 w-11" />}
      </View>

      {photos.length === 0 ? (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1 justify-center px-6">
          <PressableScale
            onPress={choose}
            accessibilityRole="button"
            accessibilityLabel="Choose photos"
            pressedScale={0.98}
            className="items-center rounded-[32px] border-2 border-dashed border-emerald-400/40 bg-emerald-400/[0.06] px-6 py-12"
          >
            <View className="h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15">
              <MaterialCommunityIcons name="view-dashboard-outline" className="text-[40px] text-emerald-300" />
            </View>
            <Text className="mt-5 font-extrabold text-xl text-white">Choose 2–4 photos</Text>
            <Text className="mt-2 text-center font-regular text-sm leading-5 text-content-secondary">
              Pick a layout, then drag inside any frame to adjust each photo.
            </Text>
          </PressableScale>
        </Animated.View>
      ) : (
        <>
          <View
            className="my-3 flex-1 items-center justify-center"
            onLayout={(e) => setArea({ width: e.nativeEvent.layout.width - 40, height: e.nativeEvent.layout.height })}
          >
            {size && (
              <Animated.View entering={FadeIn.duration(300)} className="shadow-2xl shadow-black/60">
                <CollageCanvas
                  ref={canvas}
                  width={size.width}
                  height={size.height}
                  layout={layout}
                  photos={photos}
                  pans={pans}
                  onPanChange={(i, p) => setPans((ps) => ps.map((old, j) => (j === i ? p : old)))}
                  gap={style.gap}
                  radius={style.radius}
                  background={style.background}
                  frozen={frozen}
                  onFrozenLoad={onFrozenLoad}
                />
              </Animated.View>
            )}
          </View>

          <View className="rounded-t-[32px] border-t border-white/10 bg-surface/90 pb-safe-offset-4 pt-4">
            <View className="min-h-[120px] justify-center">
              {tab === 'layout' ? (
                <LayoutPicker layouts={layouts} value={layout.id} onChange={setLayoutId} />
              ) : (
                <StylePanel {...style} onChange={(patch) => setStyle((s) => ({ ...s, ...patch }))} />
              )}
            </View>

            <View className="mx-5 mt-3 flex-row gap-2">
              <View className="flex-1 flex-row rounded-full border border-white/10 bg-white/5 p-1">
                {(['layout', 'style'] as const).map((t) => {
                  const on = t === tab;
                  return (
                    <PressableScale
                      key={t}
                      onPress={() => setTab(t)}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: on }}
                      className={`flex-1 items-center rounded-full py-2 ${on ? 'bg-primary/20' : ''}`}
                    >
                      <Text className={`font-semibold text-[13px] ${on ? 'text-primary-light' : 'text-white/70'}`}>
                        {t === 'layout' ? 'Layout' : 'Style'}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
              <PressableScale
                onPress={choose}
                accessibilityRole="button"
                accessibilityLabel="Change photos"
                className="flex-row items-center rounded-full border border-white/15 bg-white/5 px-3.5"
              >
                <MaterialCommunityIcons name="image-multiple-outline" className="text-base text-white" />
              </PressableScale>
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
        </>
      )}

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
    </View>
  );
}
