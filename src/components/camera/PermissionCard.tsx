import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Text, View } from 'react-native';

import GradientButton from '../GradientButton';

type Props = {
  canAskAgain: boolean;
  onRequest: () => void;
};

export default function PermissionCard({ canAskAgain, onRequest }: Props) {
  return (
    <View className="mx-6 items-center rounded-[28px] border border-primary-light/25 bg-surface/95 px-6 py-8">
      <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary/15">
        <MaterialCommunityIcons name="camera-outline" className="text-[34px] text-primary" />
      </View>
      <Text className="mt-5 text-center font-bold text-xl text-content-primary">
        Camera access brings the studio to life
      </Text>
      <Text className="mt-2 text-center font-regular text-sm leading-5 text-content-secondary">
        {canAskAgain
          ? 'Allow the camera to take live beauty portraits. Photos stay on your device.'
          : 'Camera access is turned off. Enable it in Settings to take photos.'}
      </Text>
      <View className="mt-6 w-full">
        <GradientButton
          label={canAskAgain ? 'Allow camera' : 'Open settings'}
          icon={canAskAgain ? 'camera' : 'cog-outline'}
          onPress={canAskAgain ? onRequest : () => Linking.openSettings()}
        />
      </View>
    </View>
  );
}
