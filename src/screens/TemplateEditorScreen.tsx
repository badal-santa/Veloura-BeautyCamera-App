import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useImage, type DataSourceParam } from '@shopify/react-native-skia';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';

import FilterPanel from '../components/camera/FilterPanel';
import RoundIconButton from '../components/camera/RoundIconButton';
import Slider from '../components/camera/Slider';
import GradientButton from '../components/GradientButton';
import PressableScale from '../components/PressableScale';
import type { Pan } from '../components/templates/PhotoSlot';
import TemplateCanvas from '../components/templates/TemplateCanvas';
import TemplateTabs, { type TemplateTab } from '../components/templates/TemplateTabs';
import { findTemplate, TEMPLATES } from '../data/templates';
import { maybeShowInterstitial } from '../features/ads/ads';
import { FULL_RECT, fitRect } from '../features/beauty/crop';
import { exportEditedImage } from '../features/beauty/exportImage';
import { prepareImage } from '../features/beauty/prepareImage';
import { NEUTRAL_EDIT, type FilterId } from '../features/beauty/types';
import { saveCreation } from '../features/media/creations';
import { settingsStore } from '../features/settings/settings';
import { pickPhoto } from '../features/media/pickPhoto';
import { exportTemplate } from '../features/templates/exportTemplate';
import { useFrozenSlots } from '../features/templates/freezeSlots';
import { templateLayout } from '../features/templates/layout';
import type { RootStackScreenProps } from '../navigation/types';

const RATIOS = { '4:5': [4, 5], '9:16': [9, 16], '1:1': [1, 1] } as const;
// Preview-quality photo for the canvas; the exported image is captured at screen density.
const PHOTO_EDGE = 1600;

export default function TemplateEditorScreen({ navigation, route }: RootStackScreenProps<'TemplateEditor'>) {
  const { templateId, uri, rotation = 0 } = route.params;
  const template = findTemplate(templateId) ?? TEMPLATES[0];

  // No photo yet → preview the design with the template's sample image.
  const hasOwnPhoto = uri != null;
  const source = useImage((uri ?? template.image) as DataSourceParam);
  const image = useMemo(() => (source ? prepareImage(source, rotation) : null), [source, rotation]);

  const [filter, setFilter] = useState<FilterId>(template.design.filter);
  const [caption, setCaption] = useState(template.design.caption);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [tab, setTab] = useState<TemplateTab>('photo');
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [working, setWorking] = useState<'save' | 'share' | null>(null);
  const [saved, setSaved] = useState(false);
  const [, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true, granularPermissions: ['photo'] });
  const canvas = useRef<View>(null);
  const { frozen, onFrozenLoad, withFrozen } = useFrozenSlots();

  // Upright, filtered copy of the photo for the canvas.
  const photo = useMemo(() => {
    if (!image) return null;
    const scale = Math.min(1, PHOTO_EDGE / Math.max(image.width(), image.height()));
    return {
      uri: exportEditedImage(image, { ...NEUTRAL_EDIT, filter }, FULL_RECT, PHOTO_EDGE),
      width: image.width() * scale,
      height: image.height() * scale,
    };
  }, [image, filter]);

  const [rw, rh] = RATIOS[template.ratio];
  const size = area.width > 0 ? fitRect(rw, rh, area.width, area.height) : null;

  const changePhoto = async () => {
    const next = await pickPhoto();
    if (!next) return;
    setPan({ x: 0, y: 0 });
    setZoom(1);
    navigation.setParams({ uri: next.uri, rotation: next.rotation });
  };

  // Snapshot with the photo pre-cropped (view snapshots ignore clipping).
  const snapshot = () => {
    if (!photo || !size) throw new Error('Template not ready');
    const rect = templateLayout(template.design.frame, size.width, size.height).photo;
    return withFrozen(
      [{ uri: photo.uri, imageWidth: photo.width, imageHeight: photo.height, rect, zoom, pan }],
      () => exportTemplate(canvas),
    );
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
      await Sharing.shareAsync(await snapshot(), { mimeType: 'image/jpeg', dialogTitle: 'Share your design' });
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
        <View className="items-center">
          <Text className="font-bold text-base text-white">{template.title}</Text>
          <Text className="font-regular text-[11px] text-white/50">
            {template.description} · {template.ratio}
          </Text>
        </View>
        <RoundIconButton icon="share-variant" label="Share" onPress={share} />
      </View>

      <View
        className="my-3 flex-1 items-center justify-center px-5"
        onLayout={(e) => setArea({ width: e.nativeEvent.layout.width - 40, height: e.nativeEvent.layout.height })}
      >
        {size && photo ? (
          <Animated.View entering={FadeIn.duration(300)} className="overflow-hidden rounded-xl shadow-2xl shadow-primary/30">
            <TemplateCanvas
              ref={canvas}
              template={template}
              width={size.width}
              height={size.height}
              photo={photo}
              zoom={zoom}
              pan={pan}
              onPanChange={setPan}
              caption={caption || ' '}
              frozenUri={frozen?.[0]}
              onFrozenLoad={onFrozenLoad}
            />
          </Animated.View>
        ) : (
          <ActivityIndicator color="#FF4FA3" />
        )}
      </View>

      <View className="rounded-t-[32px] border-t border-white/10 bg-surface/80 pb-safe-offset-4 pt-4">
        <View className="min-h-[96px] justify-center">
          {tab === 'photo' && (
            <View className="px-5">
              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons name="magnify-minus-outline" className="text-lg text-white/60" />
                <View className="flex-1">
                  <Slider
                    value={Math.round(zoom * 100)}
                    min={100}
                    max={300}
                    onChange={(v) => setZoom(v / 100)}
                    accessibilityLabel="Zoom photo"
                  />
                </View>
                <MaterialCommunityIcons name="magnify-plus-outline" className="text-lg text-white/60" />
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="font-regular text-xs text-white/50">
                  {hasOwnPhoto ? 'Drag the photo to reposition' : 'Sample photo shown'}
                </Text>
                <PressableScale
                  onPress={changePhoto}
                  accessibilityRole="button"
                  className={`flex-row items-center rounded-full px-3.5 py-2 ${
                    hasOwnPhoto ? 'border border-white/15 bg-white/5' : 'bg-primary'
                  }`}
                >
                  <MaterialCommunityIcons
                    name={hasOwnPhoto ? 'image-sync-outline' : 'image-plus-outline'}
                    className="text-base text-white"
                  />
                  <Text className="ml-1.5 font-semibold text-[13px] text-white">
                    {hasOwnPhoto ? 'Change photo' : 'Add your photo'}
                  </Text>
                </PressableScale>
              </View>
            </View>
          )}

          {tab === 'text' && (
            <View className="px-5">
              <View className="flex-row items-center rounded-2xl border border-white/15 bg-white/5 px-4">
                <MaterialCommunityIcons name="format-text" className="text-lg text-primary-light" />
                <TextInput
                  value={caption}
                  onChangeText={setCaption}
                  maxLength={40}
                  placeholder="Write a caption"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  className="ml-2 flex-1 py-3.5 font-medium text-[15px] text-white"
                />
              </View>
              <Pressable
                onPress={() => setCaption(template.design.caption)}
                accessibilityRole="button"
                hitSlop={6}
                className="mt-2 self-end"
              >
                <Text className="font-semibold text-xs text-white/60">Reset text</Text>
              </Pressable>
            </View>
          )}

          {tab === 'filter' && <FilterPanel selected={filter} onSelect={setFilter} sample={image} />}
        </View>

        <View className="mt-3">
          <TemplateTabs tab={tab} onChange={setTab} />
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
