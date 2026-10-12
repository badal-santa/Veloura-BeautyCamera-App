import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useImage } from '@shopify/react-native-skia';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';

import CropOverlay from '../components/camera/CropOverlay';
import CropPanel from '../components/camera/CropPanel';
import EditControls from '../components/camera/EditControls';
import EditedPhoto from '../components/camera/EditedPhoto';
import RoundIconButton from '../components/camera/RoundIconButton';
import UndoRedo from '../components/UndoRedo';
import MakeupPanel from '../components/camera/MakeupPanel';
import GradientButton from '../components/GradientButton';
import {
  FULL_RECT,
  fitRect,
  rectForAspect,
  type CropAspect,
  type NormRect,
  type Rotation,
} from '../features/beauty/crop';
import { exportEditedImage } from '../features/beauty/exportImage';
import { detectFaces } from '../features/beauty/faceDetection';
import type { DetectedFace } from '../features/beauty/faces';
import { prepareImage } from '../features/beauty/prepareImage';
import { NEUTRAL_EDIT, type EditMode, type EditState } from '../features/beauty/types';
import { NO_MAKEUP, type MakeupKey, type MakeupState } from '../features/beauty/makeup';
import { makeEditActions } from '../features/beauty/useEditState';
import { useHistory } from '../lib/useHistory';
import { saveCreation } from '../features/media/creations';
import { settingsStore } from '../features/settings/settings';
import { applyPreset } from '../features/media/presets';
import type { RootStackScreenProps } from '../navigation/types';

export default function PhotoReviewScreen({ navigation, route }: RootStackScreenProps<'PhotoReview'>) {
  const { uri, edit: initialEdit, source = 'camera', rotation: initialRotation = 0, preset } = route.params;
  const fromCamera = source === 'camera';
  const photo = useImage(uri);
  const [, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true, granularPermissions: ['photo'] });

  // Everything the user changes lives in one undoable document.
  type Doc = { edit: EditState; makeup: MakeupState; rotation: Rotation; aspect: CropAspect; crop: NormRect };
  const history = useHistory<Doc>({
    // Gallery photos start untouched (plus any preset); camera photos keep their live settings.
    edit: initialEdit ?? applyPreset(NEUTRAL_EDIT, preset),
    makeup: NO_MAKEUP,
    rotation: initialRotation,
    aspect: preset?.aspect ?? 'original',
    crop: FULL_RECT,
  });
  const { edit, makeup, rotation, aspect, crop } = history.state;
  const setDoc = history.set;
  const editActions = useMemo(
    () => makeEditActions((fn, group) => setDoc((d) => ({ ...d, edit: fn(d.edit) }), group)),
    [setDoc],
  );
  const editState = { edit, ...editActions };
  const setCrop = (next: NormRect) => setDoc((d) => ({ ...d, crop: next }), 'crop.drag');
  const setMakeup = (key: MakeupKey, patch: Partial<MakeupState[MakeupKey]>) =>
    setDoc((d) => ({ ...d, makeup: { ...d.makeup, [key]: { ...d.makeup[key], ...patch } } }), `makeup.${key}`);

  const [mode, setMode] = useState<EditMode>(preset?.mode ?? 'beauty');
  const [makeupTool, setMakeupTool] = useState<MakeupKey>('lipstick');

  const image = useMemo(() => (photo ? prepareImage(photo, rotation) : null), [photo, rotation]);

  // Face-aware beauty: find faces once per (rotated) image, on device.
  const [faces, setFaces] = useState<DetectedFace[]>([]);
  useEffect(() => {
    if (!image) return;
    let alive = true;
    detectFaces(image).then((found) => alive && setFaces(found));
    return () => {
      alive = false;
    };
  }, [image]);

  // Apply a preset crop (e.g. Story 9:16) once the photo's size is known.
  const [presetCropApplied, setPresetCropApplied] = useState(!preset?.aspect);
  if (image && !presetCropApplied) {
    setPresetCropApplied(true);
    history.replace((d) => ({ ...d, crop: rectForAspect(aspect, image.width(), image.height()) }));
  }

  const [area, setArea] = useState({ width: 0, height: 0 });
  const [showOriginal, setShowOriginal] = useState(false);
  const [working, setWorking] = useState<'save' | 'share' | null>(null);
  const [saved, setSaved] = useState(false);

  const cropping = mode === 'crop';

  const changeAspect = (next: CropAspect) =>
    setDoc((d) => ({ ...d, aspect: next, crop: image ? rectForAspect(next, image.width(), image.height()) : d.crop }));

  const rotate = () =>
    setDoc((d) => ({
      ...d,
      rotation: ((d.rotation + 90) % 360) as Rotation,
      // Dimensions swap on rotation, so recompute the crop for the new shape.
      crop: image ? rectForAspect(d.aspect, image.height(), image.width()) : d.crop,
    }));

  const resetCrop = () => setDoc((d) => ({ ...d, rotation: initialRotation, aspect: 'original', crop: FULL_RECT }));

  const render = () => {
    if (!image) throw new Error('Photo not loaded yet');
    return exportEditedImage(image, edit, crop, undefined, faces, makeup);
  };

  const save = async () => {
    setWorking('save');
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow photo access to save your edits.');
        return;
      }
      const rendered = render();
      await MediaLibrary.Asset.create(rendered);
      if (settingsStore.get().saveCreations) await saveCreation(rendered);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      Alert.alert('Could not save photo', e instanceof Error ? e.message : String(e));
    } finally {
      setWorking(null);
    }
  };

  // Carry the current edit into Decorate (stickers, text, watermark).
  const decorate = () => {
    try {
      navigation.navigate('Decorate', { uri: render() });
    } catch (e) {
      Alert.alert('Could not open', e instanceof Error ? e.message : String(e));
    }
  };

  const share = async () => {
    setWorking('share');
    try {
      await Sharing.shareAsync(render(), { mimeType: 'image/jpeg', dialogTitle: 'Share your glow' });
    } catch (e) {
      Alert.alert('Could not share photo', e instanceof Error ? e.message : String(e));
    } finally {
      setWorking(null);
    }
  };

  const fullFrame = image ? fitRect(image.width(), image.height(), area.width, area.height) : null;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-5 pt-safe-offset-2">
        <RoundIconButton icon="arrow-left" label={fromCamera ? 'Retake' : 'Back'} onPress={() => navigation.goBack()} />
        <Text className="font-bold text-base text-white">
          {cropping ? 'Crop' : fromCamera ? 'Your glow' : 'Edit photo'}
        </Text>
        <View className="flex-row gap-2">
          <UndoRedo history={history} />
          <RoundIconButton icon="sticker-emoji" label="Add stickers and text" onPress={decorate} />
          <RoundIconButton icon="share-variant" label="Share" onPress={share} />
        </View>
      </View>

      <View
        className="my-3 flex-1 items-center justify-center"
        onLayout={(e) => setArea({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        {image && area.width > 0 ? (
          <>
            <EditedPhoto
              image={image}
              edit={edit}
              makeup={makeup}
              width={area.width}
              height={area.height}
              // While cropping, show the whole photo with the crop frame on top.
              crop={cropping ? FULL_RECT : crop}
              original={showOriginal}
              faces={faces}
            />
            {cropping && fullFrame && <CropOverlay frame={fullFrame} crop={crop} onChange={setCrop} />}
            {faces.length > 0 && mode === 'beauty' && (
              <Animated.View entering={FadeIn.duration(300)} pointerEvents="none" className="absolute top-2 flex-row items-center rounded-full bg-black/55 px-3 py-1.5">
                <MaterialCommunityIcons name="face-recognition" className="text-sm text-primary-light" />
                <Text className="ml-1.5 font-semibold text-[11px] text-white">
                  Skin-smart beauty · {faces.length} {faces.length === 1 ? 'face' : 'faces'}
                </Text>
              </Animated.View>
            )}
          </>
        ) : (
          <ActivityIndicator color="#FF4FA3" />
        )}
      </View>

      <View className="rounded-t-[32px] border-t border-white/10 bg-surface/80 pb-safe-offset-4 pt-4">
        <EditControls
          {...editState}
          filterSample={image}
          onBeforeChange={setShowOriginal}
          mode={mode}
          onModeChange={setMode}
          makeupPanel={
            <MakeupPanel
              makeup={makeup}
              tool={makeupTool}
              onToolChange={setMakeupTool}
              onChange={setMakeup}
              hasFace={faces.length > 0}
            />
          }
          cropPanel={
            <CropPanel aspect={aspect} onAspectChange={changeAspect} onRotate={rotate} onReset={resetCrop} />
          }
        />
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
    </View>
  );
}
