import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas, Picture, Skia, useImage, type DataSourceParam, type SkImage } from '@shopify/react-native-skia';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';

import RoundIconButton from '../components/camera/RoundIconButton';
import GradientButton from '../components/GradientButton';
import { FULL_RECT, fitRect } from '../features/beauty/crop';
import { exportEditedImage } from '../features/beauty/exportImage';
import { prepareImage } from '../features/beauty/prepareImage';
import { NEUTRAL_EDIT } from '../features/beauty/types';
import { VelouraLauncher } from '../features/launcher/launcher';
import { saveCreation } from '../features/media/creations';
import { pickPhoto } from '../features/media/pickPhoto';
import { BACKDROP_COLORS, BACKDROP_GRADIENTS, compose, exportComposite, type Backdrop } from '../features/removebg/compose';
import { settingsStore } from '../features/settings/settings';
import type { RootStackScreenProps } from '../navigation/types';

type Kind = Backdrop['kind'];
type Status = 'working' | 'ready' | 'none' | 'error';

export default function RemoveBgScreen({ navigation, route }: RootStackScreenProps<'RemoveBg'>) {
  const { uri, rotation = 0 } = route.params;
  const source = useImage(uri);
  // Upright, ≤1600px copy: what the segmenter sees and what the export matches.
  const original = useMemo(() => {
    if (!source) return null;
    const upright = prepareImage(source, rotation);
    const fileUri = exportEditedImage(upright, NEUTRAL_EDIT, FULL_RECT, 1600);
    return { fileUri, image: upright };
  }, [source, rotation]);

  const [status, setStatus] = useState<Status>('working');
  const [cutoutUri, setCutoutUri] = useState<string | null>(null);
  const cutout = useImage((cutoutUri ?? null) as DataSourceParam);
  const [backdropPhoto, setBackdropPhoto] = useState<string | null>(null);
  const backdropImage = useImage((backdropPhoto ?? null) as DataSourceParam);
  const [backdrop, setBackdrop] = useState<Exclude<Backdrop, { kind: 'photo' }> | { kind: 'photo' }>({ kind: 'transparent' });
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [working, setWorking] = useState<'save' | 'share' | null>(null);
  const [saved, setSaved] = useState(false);
  const [, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true, granularPermissions: ['photo'] });

  // Cut the person out, on device.
  useEffect(() => {
    if (!original || !VelouraLauncher) return;
    let alive = true;
    VelouraLauncher.removeBackground(original.fileUri)
      .then((r) => {
        if (!alive) return;
        if (r.coverage < 0.01) setStatus('none');
        else {
          setCutoutUri(r.uri);
          setStatus('ready');
        }
      })
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
  }, [original]);

  const resolved = useMemo<Backdrop | null>(
    () => (backdrop.kind === 'photo' ? (backdropImage ? { kind: 'photo', image: backdropImage } : null) : backdrop),
    [backdrop, backdropImage],
  );

  const size = cutout && area.width > 0 ? fitRect(cutout.width(), cutout.height(), area.width, area.height) : null;

  const picture = useMemo(() => {
    if (!cutout || !original || !size || !resolved) return null;
    const rec = Skia.PictureRecorder();
    const c = rec.beginRecording(Skia.XYWHRect(0, 0, size.width, size.height));
    compose(c, size.width, size.height, cutout, original.image, resolved);
    return rec.finishRecordingAsPicture();
  }, [cutout, original, size, resolved]);

  const choosePhoto = async () => {
    const p = await pickPhoto();
    if (!p) return;
    setBackdropPhoto(p.uri);
    setBackdrop({ kind: 'photo' });
  };

  const render = () => {
    if (!cutout || !original || !resolved) throw new Error('Not ready yet');
    return exportComposite(cutout, original.image as SkImage, resolved);
  };

  const save = async () => {
    setWorking('save');
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow photo access to save your photo.');
        return;
      }
      const out = render();
      await MediaLibrary.Asset.create(out.uri);
      // My creations only lists JPEGs.
      if (!out.png && settingsStore.get().saveCreations) await saveCreation(out.uri);
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
      const out = render();
      await Sharing.shareAsync(out.uri, { mimeType: out.png ? 'image/png' : 'image/jpeg', dialogTitle: 'Share your photo' });
    } catch (e) {
      Alert.alert('Could not share', e instanceof Error ? e.message : String(e));
    } finally {
      setWorking(null);
    }
  };

  const isSelected = (b: Backdrop | { kind: Kind; key?: string }, key?: string) =>
    backdrop.kind === b.kind &&
    (key == null ||
      (backdrop.kind === 'color' && backdrop.color === key) ||
      (backdrop.kind === 'gradient' && backdrop.colors.join() === key));

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-5 pt-safe-offset-2">
        <RoundIconButton icon="arrow-left" label="Back" onPress={() => navigation.goBack()} />
        <View className="items-center">
          <Text className="font-bold text-base text-white">Remove background</Text>
          <Text className="font-regular text-[11px] text-white/50">On-device · nothing uploaded</Text>
        </View>
        {status === 'ready' ? <RoundIconButton icon="share-variant" label="Share" onPress={share} /> : <View className="h-11 w-11" />}
      </View>

      <View
        className="my-3 flex-1 items-center justify-center"
        onLayout={(e) => setArea({ width: e.nativeEvent.layout.width - 40, height: e.nativeEvent.layout.height })}
      >
        {status === 'working' && (
          <View className="items-center">
            <ActivityIndicator color="#FF4FA3" size="large" />
            <Text className="mt-4 font-medium text-sm text-white/70">Finding you…</Text>
          </View>
        )}
        {(status === 'none' || status === 'error') && (
          <View className="mx-8 items-center">
            <MaterialCommunityIcons name="account-search-outline" className="text-[48px] text-white/40" />
            <Text className="mt-4 text-center font-bold text-lg text-white">
              {status === 'none' ? 'No person found' : 'Something went wrong'}
            </Text>
            <Text className="mt-1 text-center font-regular text-sm text-white/60">
              Remove BG works best on photos of people, like selfies and portraits.
            </Text>
          </View>
        )}
        {status === 'ready' && size && (
          <Animated.View entering={FadeIn.duration(400)} className="overflow-hidden rounded-xl" style={{ width: size.width, height: size.height }}>
            {/* Checkerboard shows transparency. */}
            {backdrop.kind === 'transparent' && <Checkerboard width={size.width} height={size.height} />}
            {picture && (
              <Canvas style={{ width: size.width, height: size.height }}>
                <Picture picture={picture} />
              </Canvas>
            )}
          </Animated.View>
        )}
      </View>

      {status === 'ready' && (
        <View className="rounded-t-[32px] border-t border-white/10 bg-surface/90 pb-safe-offset-4 pt-4">
          <Text className="mb-2.5 px-5 font-bold text-[11px] tracking-[1.5px] text-white/50">BACKGROUND</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="items-center gap-2.5 px-5">
            <Swatch label="None" selected={isSelected({ kind: 'transparent' })} onPress={() => setBackdrop({ kind: 'transparent' })}>
              <Checkerboard width={44} height={44} />
            </Swatch>
            <Swatch label="Blur" selected={isSelected({ kind: 'blur' })} onPress={() => setBackdrop({ kind: 'blur' })}>
              <MaterialCommunityIcons name="blur" className="text-xl text-white" />
            </Swatch>
            <Swatch label="Photo" selected={isSelected({ kind: 'photo' })} onPress={choosePhoto}>
              <MaterialCommunityIcons name="image-plus-outline" className="text-xl text-white" />
            </Swatch>
            <View className="h-8 w-px bg-white/10" />
            {BACKDROP_GRADIENTS.map((g) => (
              <Swatch key={g.join()} selected={isSelected({ kind: 'gradient' }, g.join())} onPress={() => setBackdrop({ kind: 'gradient', colors: g })}>
                <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
              </Swatch>
            ))}
            {BACKDROP_COLORS.map((c) => (
              <Swatch key={c} selected={isSelected({ kind: 'color' }, c)} onPress={() => setBackdrop({ kind: 'color', color: c })} color={c} />
            ))}
          </ScrollView>

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

function Swatch({
  children,
  label,
  selected,
  onPress,
  color,
}: {
  children?: React.ReactNode;
  label?: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={label ?? color} className="items-center">
      <View
        className={`h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 ${selected ? 'border-primary' : 'border-white/10'} bg-white/5`}
        style={color ? { backgroundColor: color } : undefined}
      >
        {children}
      </View>
      {label && <Text className={`mt-1 font-semibold text-[10px] ${selected ? 'text-primary-light' : 'text-white/60'}`}>{label}</Text>}
    </Pressable>
  );
}

/** Grey/white squares — the usual "transparent" pattern. */
function Checkerboard({ width, height }: { width: number; height: number }) {
  const s = 12;
  const cols = Math.ceil(width / s);
  const rows = Math.ceil(height / s);
  return (
    <View className="absolute inset-0 bg-white">
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) =>
          (r + c) % 2 ? null : (
            <View key={`${r}-${c}`} className="absolute bg-neutral-300" style={{ left: c * s, top: r * s, width: s, height: s }} />
          ),
        ),
      )}
    </View>
  );
}
