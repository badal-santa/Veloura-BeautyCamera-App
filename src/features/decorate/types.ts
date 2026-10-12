export type TextStyle = 'plain' | 'pill' | 'neon';
export type Corner = 'tl' | 'tr' | 'bl' | 'br';

export type Layer = {
  id: string;
  kind: 'sticker' | 'text';
  content: string;
  /** Text color (stickers ignore it). */
  color: string;
  textStyle: TextStyle;
  /** Center position, normalized 0–1 of the canvas. */
  x: number;
  y: number;
  scale: number;
  /** Radians. */
  rotation: number;
};

export type Watermark = {
  enabled: boolean;
  text: string;
  corner: Corner;
  /** 0–1 */
  opacity: number;
};

export const STICKERS = [
  '✨', '💖', '🌸', '👑', '🦋', '⭐', '🌙', '🔥', '💋', '🎀',
  '☁️', '🌈', '💎', '🍓', '🌼', '💫', '😍', '😎', '🥰', '🫶',
  '🌷', '🍒', '🧸', '📸', '🎧', '☕', '🌊', '🌻', '💌', '🪩',
];

export const TEXT_COLORS = ['#FFFFFF', '#FF4FA3', '#C084FC', '#FFB38A', '#FBBF24', '#34D399', '#60A5FA', '#111111'];

export const DEFAULT_WATERMARK: Watermark = { enabled: false, text: '@veloura', corner: 'br', opacity: 0.8 };

let seq = 0;
export const newLayerId = () => `layer-${Date.now()}-${seq++}`;
