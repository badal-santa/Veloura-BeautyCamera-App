import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView, type VideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOutUp } from 'react-native-reanimated';

import RoundIconButton from '../components/camera/RoundIconButton';
import GlowBackdrop from '../components/GlowBackdrop';
import GradientButton from '../components/GradientButton';
import PressableScale from '../components/PressableScale';
import TrimTimeline from '../components/video/TrimTimeline';
import { maybeShowInterstitial } from '../features/ads/ads';
import { VelouraLauncher } from '../features/launcher/launcher';
import { pickVideo } from '../features/media/pickVideo';
import { formatMs } from '../lib/formatTime';
import type { RootStackScreenProps } from '../navigation/types';
import type { VideoInfo } from '../../modules/veloura-launcher';

const THUMBS = 10;

// Player setters live outside the component (players are mutable native objects).
const seekTo = (p: VideoPlayer, ms: number) => {
  p.currentTime = ms / 1000;
};
const setPlayerMuted = (p: VideoPlayer, muted: boolean) => {
  p.muted = muted;
};

export default function VideoStudioScreen({ navigation, route }: RootStackScreenProps<'VideoStudio'>) {
  const [uri, setUri] = useState<string | null>(null);
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [muted, setMuted] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true, granularPermissions: ['photo', 'video'] });

  const player = useVideoPlayer(null, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.1;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // Keep playback inside the trimmed range (loop it).
  const rangeRef = useRef(range);
  useEffect(() => {
    rangeRef.current = range;
  }, [range]);
  useEffect(() => {
    const sub = player.addListener('timeUpdate', ({ currentTime }) => {
      const ms = currentTime * 1000;
      setPositionMs(ms);
      const { start, end } = rangeRef.current;
      if (end > 0 && ms >= end) seekTo(player, start);
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    setPlayerMuted(player, muted);
  }, [player, muted]);

  const load = async (picked: string) => {
    try {
      if (!VelouraLauncher) return;
      const meta = await VelouraLauncher.getVideoInfo(picked);
      if (meta.durationMs <= 0) throw new Error('This video could not be read.');
      setUri(picked);
      setInfo(meta);
      setRange({ start: 0, end: meta.durationMs });
      setMuted(false);
      setLastExport(null);
      setThumbs([]);
      await player.replaceAsync({ uri: picked });
      player.play();
      setThumbs(await VelouraLauncher.getVideoThumbnails(picked, THUMBS, 160));
    } catch (e) {
      Alert.alert('Could not open video', e instanceof Error ? e.message : String(e));
    }
  };

  const choose = async () => {
    const picked = await pickVideo();
    if (picked) await load(picked);
  };

  // Opened with a video (e.g. veloura://video?uri=…).
  const initialUri = route.params?.uri;
  useEffect(() => {
    if (!initialUri) return;
    const id = setTimeout(() => load(initialUri), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUri]);

  const togglePlay = () => (isPlaying ? player.pause() : player.play());

  const exportVideo = async () => {
    if (!uri || !VelouraLauncher) return;
    setExporting(true);
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow access to save your video.');
        return;
      }
      player.pause();
      const out = await VelouraLauncher.trimVideo(uri, range.start, range.end, muted);
      await MediaLibrary.Asset.create(out.uri);
      setLastExport(out.uri);
      setSaved(true);
      maybeShowInterstitial();
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : String(e));
    } finally {
      setExporting(false);
    }
  };

  const share = async () => {
    if (lastExport) await Sharing.shareAsync(lastExport, { mimeType: 'video/mp4', dialogTitle: 'Share your clip' });
  };

  const length = range.end - range.start;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(168, 85, 247, 0.18)" />

      <View className="flex-row items-center justify-between px-5 pt-safe-offset-2">
        <RoundIconButton icon="arrow-left" label="Back" onPress={() => navigation.goBack()} />
        <View className="items-center">
          <Text className="font-bold text-base text-white">Video Studio</Text>
          <Text className="font-regular text-[11px] text-white/50">On-device · no re-encoding</Text>
        </View>
        {lastExport ? (
          <RoundIconButton icon="share-variant" label="Share clip" onPress={share} />
        ) : (
          <View className="h-11 w-11" />
        )}
      </View>

      {!uri ? (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1 justify-center px-6">
          <PressableScale
            onPress={choose}
            accessibilityRole="button"
            accessibilityLabel="Choose a video"
            pressedScale={0.98}
            className="items-center rounded-[32px] border-2 border-dashed border-secondary-light/40 bg-secondary/[0.07] px-6 py-12"
          >
            <View className="h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
              <MaterialCommunityIcons name="movie-open-plus-outline" className="text-[40px] text-secondary-light" />
            </View>
            <Text className="mt-5 font-extrabold text-xl text-white">Choose a video</Text>
            <Text className="mt-2 text-center font-regular text-sm leading-5 text-content-secondary">
              Trim the best moment and drop the sound if you like. Exports instantly, at full quality.
            </Text>
          </PressableScale>
        </Animated.View>
      ) : (
        <>
          {/* Preview */}
          <Pressable onPress={togglePlay} accessibilityLabel={isPlaying ? 'Pause' : 'Play'} className="my-3 flex-1 justify-center">
            <VideoView player={player} nativeControls={false} contentFit="contain" className="h-full w-full" />
            {!isPlaying && (
              <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-black/50">
                  <MaterialCommunityIcons name="play" className="text-[36px] text-white" />
                </View>
              </View>
            )}
          </Pressable>

          {/* Editor panel */}
          <View className="rounded-t-[32px] border-t border-white/10 bg-surface/90 pb-safe-offset-4 pt-4">
            <View className="mb-3 flex-row items-end justify-between px-5">
              <View>
                <Text className="font-medium text-[11px] tracking-[1.5px] text-white/50">CLIP LENGTH</Text>
                <Text className="font-extrabold text-2xl text-white">{formatMs(length)}</Text>
              </View>
              <Text className="font-medium text-xs text-white/50">
                {formatMs(range.start)} – {formatMs(range.end)}
              </Text>
            </View>

            {info && (
              <TrimTimeline
                thumbnails={thumbs}
                durationMs={info.durationMs}
                startMs={range.start}
                endMs={range.end}
                positionMs={positionMs}
                onChange={(start, end) => setRange({ start, end })}
                onCommit={(which) => {
                  seekTo(player, which === 'start' ? range.start : Math.max(range.start, range.end - 1500));
                  player.play();
                }}
              />
            )}

            <View className="mt-4 flex-row gap-2.5 px-5">
              <Chip icon={isPlaying ? 'pause' : 'play'} label={isPlaying ? 'Pause' : 'Play'} onPress={togglePlay} />
              <Chip
                icon={muted ? 'volume-off' : 'volume-high'}
                label={muted ? 'Sound off' : 'Sound on'}
                active={muted}
                disabled={!info?.hasAudio}
                onPress={() => setMuted((m) => !m)}
              />
              <Chip icon="swap-horizontal" label="Change" onPress={choose} />
            </View>

            <View className="mt-4 px-5">
              {exporting ? (
                <View className="h-[58px] flex-row items-center justify-center">
                  <ActivityIndicator color="#FF4FA3" />
                  <Text className="ml-3 font-semibold text-sm text-white/70">Exporting…</Text>
                </View>
              ) : (
                <GradientButton label="Export video" icon="download" onPress={exportVideo} />
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

function Chip({
  icon,
  label,
  onPress,
  active,
  disabled,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: active }}
      className={`flex-1 flex-row items-center justify-center rounded-full border py-2.5 ${
        active ? 'border-primary-light/50 bg-primary/20' : 'border-white/15 bg-white/5'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      <MaterialCommunityIcons name={icon} className={`text-base ${active ? 'text-primary-light' : 'text-white'}`} />
      <Text className={`ml-1.5 font-semibold text-[13px] ${active ? 'text-primary-light' : 'text-white'}`}>{label}</Text>
    </PressableScale>
  );
}
