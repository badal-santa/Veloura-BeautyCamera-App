import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';

import { Fonts } from '../theme/fonts';

/** Loads Plus Jakarta Sans under the names in theme/fonts. Returns true once usable. */
export function useAppFonts() {
  const [loaded, error] = useFonts({
    [Fonts.family.regular]: PlusJakartaSans_400Regular,
    [Fonts.family.medium]: PlusJakartaSans_500Medium,
    [Fonts.family.semiBold]: PlusJakartaSans_600SemiBold,
    [Fonts.family.bold]: PlusJakartaSans_700Bold,
    [Fonts.family.extraBold]: PlusJakartaSans_800ExtraBold,
  });
  return loaded || error != null;
}
