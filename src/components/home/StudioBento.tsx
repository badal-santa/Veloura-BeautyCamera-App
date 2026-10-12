import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

import PressableScale from '../PressableScale';

type Props = {
  onCamera: () => void;
  onEdit: () => void;
  onTemplates: () => void;
};

/** Asymmetric hero: tall camera tile + two stacked tiles. */
export default function StudioBento({ onCamera, onEdit, onTemplates }: Props) {
  return (
    <View className="mx-5 h-[236px] flex-row gap-3">
      <PressableScale
        onPress={onCamera}
        accessibilityRole="button"
        accessibilityLabel="Open beauty camera"
        pressedScale={0.97}
        className="flex-[1.15] overflow-hidden rounded-[30px]"
      >
        <Image source={require('../../../assets/images/sections/home/hero.jpg')} className="absolute inset-0 h-full w-full" resizeMode="cover" />
        <LinearGradient
          colors={['rgba(8, 7, 12, 0.05)', 'rgba(74, 13, 53, 0.55)', 'rgba(8, 7, 12, 0.92)']}
          locations={[0, 0.55, 1]}
          className="absolute inset-0"
        />
        <View className="flex-1 justify-between p-4">
          <View className="self-start rounded-full bg-black/40 px-2.5 py-1">
            <Text className="font-bold text-[10px] tracking-[1px] text-white">LIVE BEAUTY</Text>
          </View>
          <View>
            <LinearGradient
              colors={['#FF8FD1', '#FF4FA3', '#A855F7']}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              className="mb-3 h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/30"
            >
              <MaterialCommunityIcons name="camera" className="text-[22px] text-white" />
            </LinearGradient>
            <Text className="font-extrabold text-xl leading-6 text-white">Beautycamera</Text>
            <Text className="mt-1 font-regular text-[11px] text-white/70">Smooth, glow & filters live</Text>
          </View>
        </View>
      </PressableScale>

      <View className="flex-1 gap-3">
        <BentoTile
          title="Edit a photo"
          caption="From your phone"
          icon="image-edit-outline"
          tint={['rgba(168, 85, 247, 0.35)', 'rgba(168, 85, 247, 0.08)']}
          iconClass="text-secondary-light"
          onPress={onEdit}
        />
        <BentoTile
          title="Templates"
          caption="Frames & stories"
          icon="view-quilt-outline"
          tint={['rgba(255, 179, 138, 0.30)', 'rgba(255, 179, 138, 0.06)']}
          iconClass="text-accent"
          onPress={onTemplates}
        />
      </View>
    </View>
  );
}

function BentoTile({
  title,
  caption,
  icon,
  tint,
  iconClass,
  onPress,
}: {
  title: string;
  caption: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: readonly [string, string];
  iconClass: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      pressedScale={0.96}
      className="flex-1 justify-between overflow-hidden rounded-[26px] border border-white/10 bg-surface p-4"
    >
      <LinearGradient colors={tint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
      <View className="flex-row items-start justify-between">
        <MaterialCommunityIcons name={icon} className={`text-[26px] ${iconClass}`} />
        <MaterialCommunityIcons name="arrow-top-right" className="text-lg text-white/50" />
      </View>
      <View>
        <Text className="font-bold text-[15px] text-white">{title}</Text>
        <Text className="font-regular text-[11px] text-white/60">{caption}</Text>
      </View>
    </PressableScale>
  );
}
