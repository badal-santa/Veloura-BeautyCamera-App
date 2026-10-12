import { useIsFocused } from '@react-navigation/native';
import { useImage } from '@shopify/react-native-skia';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import EditControls from '../components/camera/EditControls';
import PermissionCard from '../components/camera/PermissionCard';
import RoundIconButton from '../components/camera/RoundIconButton';
import ShutterButton from '../components/camera/ShutterButton';
import PressableScale from '../components/PressableScale';
import { previewTints } from '../features/beauty/previewTint';
import { updateSettings, useSettings } from '../features/settings/settings';
import { useEditState } from '../features/beauty/useEditState';
import type { RootStackScreenProps } from '../navigation/types';

type Flash = 'off' | 'on' | 'auto';
const FLASH_CYCLE: Flash[] = ['off', 'on', 'auto'];
const FLASH_ICON = { off: 'flash-off', on: 'flash', auto: 'flash-auto' } as const;
const TIMER_CYCLE = [0, 3, 10] as const;

export default function CameraScreen({ navigation }: RootStackScreenProps<'Capture'>) {
  const isFocused = useIsFocused();
  const settings = useSettings();
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);

  const editState = useEditState();
  const sample = useImage(require('../../assets/images/sections/camera/filter-sample.jpg'));

  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState<Flash>('off');
  const [timer, setTimer] = useState<(typeof TIMER_CYCLE)[number]>(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  const flashOpacity = useSharedValue(0);
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));

  const shoot = async () => {
    if (!camera.current) return;
    setBusy(true);
    flashOpacity.set(withSequence(withTiming(0.85, { duration: 60 }), withTiming(0, { duration: 320 })));
    try {
      const photo = await camera.current.takePictureAsync({ quality: 0.95, shutterSound: settings.shutterSound });
      setLastPhoto(photo.uri);
      navigation.navigate('PhotoReview', { uri: photo.uri, edit: editState.edit });
    } finally {
      setBusy(false);
    }
  };

  // Self-timer countdown.
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => {
      if (countdown === 1) {
        setCountdown(0);
        shoot();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const onShutter = () => {
    if (!ready || busy || countdown > 0) return;
    if (timer > 0) setCountdown(timer);
    else shoot();
  };

  const tints = showOriginal ? [] : previewTints(editState.edit);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {permission?.granted && isFocused && (
        <>
          <CameraView
            ref={camera}
            className="absolute inset-0"
            facing={facing}
            flash={flash}
            mirror={facing === 'front' && settings.mirrorSelfie}
            animateShutter={false}
            onCameraReady={() => setReady(true)}
          />
          {/* Live look approximation — exact edits are applied after capture. */}
          {tints.map((t, i) => (
            <View
              key={i}
              pointerEvents="none"
              className="absolute inset-0"
              style={{ backgroundColor: t.color, mixBlendMode: t.blend }}
            />
          ))}
        </>
      )}

      {permission && !permission.granted && (
        <View className="absolute inset-0 justify-center">
          <PermissionCard canAskAgain={permission.canAskAgain} onRequest={requestPermission} />
        </View>
      )}

      {settings.cameraGrid && permission?.granted && (
        <View pointerEvents="none" className="absolute inset-0">
          <View className="absolute bottom-0 left-1/3 top-0 w-px bg-white/35" />
          <View className="absolute bottom-0 left-2/3 top-0 w-px bg-white/35" />
          <View className="absolute left-0 right-0 top-1/3 h-px bg-white/35" />
          <View className="absolute left-0 right-0 top-2/3 h-px bg-white/35" />
        </View>
      )}

      <Animated.View pointerEvents="none" style={flashStyle} className="absolute inset-0 bg-white" />

      {countdown > 0 && (
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <Animated.Text
            key={countdown}
            entering={ZoomIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="font-extrabold text-[120px] text-white"
          >
            {countdown}
          </Animated.Text>
        </View>
      )}

      {/* Top bar */}
      <View className="flex-row items-center justify-between px-5 pt-safe-offset-2">
        <RoundIconButton icon="close" label="Close camera" onPress={() => navigation.goBack()} />
        <View className="flex-row gap-2.5">
          <RoundIconButton
            icon="grid"
            label={settings.cameraGrid ? 'Hide grid' : 'Show grid'}
            active={settings.cameraGrid}
            onPress={() => updateSettings({ cameraGrid: !settings.cameraGrid })}
          />
          <RoundIconButton
            icon={FLASH_ICON[flash]}
            label={`Flash ${flash}`}
            active={flash !== 'off'}
            onPress={() => setFlash(FLASH_CYCLE[(FLASH_CYCLE.indexOf(flash) + 1) % FLASH_CYCLE.length])}
          />
          <RoundIconButton
            icon="timer-outline"
            label={timer ? `Timer ${timer} seconds` : 'Timer off'}
            badge={timer ? `${timer}s` : undefined}
            active={timer > 0}
            onPress={() => setTimer(TIMER_CYCLE[(TIMER_CYCLE.indexOf(timer) + 1) % TIMER_CYCLE.length])}
          />
        </View>
      </View>

      {/* Controls */}
      {permission?.granted && (
        <Animated.View
          entering={FadeIn.duration(400)}
          className="mt-auto rounded-t-[32px] border-t border-white/10 bg-black/55 pb-safe-offset-4 pt-4"
        >
          <EditControls {...editState} filterSample={sample} onBeforeChange={setShowOriginal} />

          <View className="mt-4 flex-row items-center justify-between px-8">
            {lastPhoto ? (
              <PressableScale
                onPress={() => navigation.navigate('PhotoReview', { uri: lastPhoto, edit: editState.edit })}
                accessibilityRole="button"
                accessibilityLabel="Open last photo"
                className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-white/70"
              >
                <Image source={{ uri: lastPhoto }} className="h-full w-full" />
              </PressableScale>
            ) : (
              <View className="h-14 w-14" />
            )}

            <ShutterButton onPress={onShutter} disabled={!ready || busy} />

            <RoundIconButton
              icon="camera-flip-outline"
              label="Switch camera"
              size="lg"
              onPress={() => {
                setReady(false);
                setFacing(facing === 'front' ? 'back' : 'front');
              }}
            />
          </View>
          {!ready && (
            <Text className="mt-2 text-center font-regular text-[11px] text-white/50">Starting camera…</Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}
