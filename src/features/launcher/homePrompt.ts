import { readJSON, writeJSON } from '../../lib/storage';
import { VelouraLauncher, isLauncherSupported } from './launcher';

const FILE = 'home-prompt.json';

/** First-run "make Veloura your Home" ask — once, Android only, skipped if already default. */
export function shouldShowHomePrompt(): boolean {
  if (!isLauncherSupported || !VelouraLauncher) return false;
  if (readJSON(FILE, { seen: false }).seen) return false;
  return !VelouraLauncher.isDefaultLauncher();
}

export function markHomePromptSeen() {
  writeJSON(FILE, { seen: true });
}
