import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas } from '@shopify/react-native-skia';
import { CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { VideoView } from 'expo-video';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { cssInterop } from 'nativewind';

// Teach NativeWind about third-party components so they accept `className`.
cssInterop(LinearGradient, { className: 'style' });
cssInterop(CameraView, { className: 'style' });
cssInterop(Canvas, { className: 'style' });
cssInterop(VideoView, { className: 'style' });
cssInterop(GestureHandlerRootView, { className: 'style' });

// Icons take color/size as props — map `text-*` color and font size onto them.
cssInterop(MaterialCommunityIcons, {
  className: { target: 'style', nativeStyleToProp: { color: true, fontSize: 'size' } },
});
