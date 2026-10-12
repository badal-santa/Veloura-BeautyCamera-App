import Constants from 'expo-constants';
import { Text, View } from 'react-native';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function ProfileFooter() {
  return (
    <View className="mt-8 items-center">
      <Text className="font-medium text-xs text-content-tertiary">Veloura · Version {APP_VERSION}</Text>
      <Text className="mt-1 font-regular text-[11px] text-content-disabled">
        Made with <Text className="text-primary">♥</Text> for your glow
      </Text>
    </View>
  );
}
