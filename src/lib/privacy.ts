import { Alert } from 'react-native';

export const showPrivacyInfo = () =>
  Alert.alert(
    'Your privacy',
    'Veloura edits photos on your device. Nothing is uploaded, there are no accounts, and no ads.\n\n' +
      'Camera and photo access are only used when you take or pick a photo. ' +
      'In Veloura Home, your app list stays on your phone and is used only to show and open your apps.',
  );
