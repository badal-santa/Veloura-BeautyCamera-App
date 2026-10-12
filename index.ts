import './global.css';
import './src/lib/nativewind-interop';

import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

import App from './App';
import LauncherRoot from './src/launcher/LauncherRoot';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Veloura Home runs in its own Android activity (see plugins/withHomeMode.js).
AppRegistry.registerComponent('launcher', () => LauncherRoot);
