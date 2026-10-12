/** 75400 → "1:15.4" (tenths shown under a minute of precision need). */
export function formatMs(ms: number, tenths = true) {
  const total = Math.max(0, ms) / 1000;
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const t = Math.floor((total * 10) % 10);
  return `${m}:${String(s).padStart(2, '0')}${tenths ? `.${t}` : ''}`;
}
