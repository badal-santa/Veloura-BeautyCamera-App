import { Linking } from 'react-native';

import type { SettingsSection } from '../screens/SettingsScreen';

/** Places in the app the Home screen can open. */
export type AppTarget =
  | { to: 'capture' }
  | { to: 'tab'; tab: 'Home' | 'Editor' | 'Templates' | 'Profile' }
  | { to: 'settings'; section?: SettingsSection }
  | { to: 'gallery' }
  | { to: 'video'; uri?: string }
  | { to: 'edit'; uri: string }
  | { to: 'decorate'; uri: string }
  | { to: 'removebg'; uri: string }
  | { to: 'collage'; uris?: string[] };

const SCHEME = 'veloura://';

export function targetToUrl(target: AppTarget): string {
  switch (target.to) {
    case 'capture':
      return `${SCHEME}capture`;
    case 'tab':
      return `${SCHEME}tab/${target.tab}`;
    case 'settings':
      return `${SCHEME}settings${target.section ? `/${target.section}` : ''}`;
    case 'gallery':
      return `${SCHEME}gallery`;
    case 'video':
      return `${SCHEME}video${target.uri ? `?uri=${encodeURIComponent(target.uri)}` : ''}`;
    case 'edit':
    case 'decorate':
    case 'removebg':
      return `${SCHEME}${target.to}?uri=${encodeURIComponent(target.uri)}`;
    case 'collage':
      return `${SCHEME}collage${target.uris?.length ? `?uris=${target.uris.map(encodeURIComponent).join(',')}` : ''}`;
  }
}

export function urlToTarget(url: string | null): AppTarget | null {
  if (!url?.startsWith(SCHEME)) return null;
  const [first, second] = url.slice(SCHEME.length).split(/[/?#]/);
  if (first === 'capture') return { to: 'capture' };
  if (first === 'gallery') return { to: 'gallery' };
  const uriParam = url.match(/[?&]uri=([^&#]+)/)?.[1];
  const uri = uriParam ? decodeURIComponent(uriParam) : undefined;
  if (first === 'video') return { to: 'video', uri };
  if ((first === 'edit' || first === 'decorate' || first === 'removebg') && uri) return { to: first, uri };
  if (first === 'collage') {
    const list = url.match(/[?&]uris=([^&#]+)/)?.[1];
    return { to: 'collage', uris: list ? list.split(',').map(decodeURIComponent) : undefined };
  }
  if (first === 'settings') return { to: 'settings', section: (second as SettingsSection) || undefined };
  if (first === 'tab' && ['Home', 'Editor', 'Templates', 'Profile'].includes(second)) {
    return { to: 'tab', tab: second as 'Home' };
  }
  return null;
}

/** From the Home screen (its own window): open the regular Veloura app at a target. */
export const openInApp = (target: AppTarget) => Linking.openURL(targetToUrl(target));
