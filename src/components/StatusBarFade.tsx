import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

/** Fades scrolling content out under the status bar. Render last, above the ScrollView. */
export default function StatusBarFade() {
  return (
    <View className="absolute inset-x-0 top-0 pb-4 pt-safe" pointerEvents="none">
      <LinearGradient
        colors={['#08070C', '#08070CE6', 'rgba(8, 7, 12, 0)']}
        locations={[0, 0.6, 1]}
        className="absolute inset-0"
      />
    </View>
  );
}
