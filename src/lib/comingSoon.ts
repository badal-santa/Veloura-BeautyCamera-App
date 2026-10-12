import { Alert } from 'react-native';

export const comingSoon = (feature: string) =>
  Alert.alert(`${feature} is coming soon`, "We're polishing this feature — it'll arrive in an update.");
