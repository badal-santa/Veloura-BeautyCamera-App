import type { ImageSourcePropType } from 'react-native';

import type { FilterId } from '../features/beauty/types';

export const TEMPLATE_CATEGORIES = ['For you', 'Stylish', 'Social', 'Story', 'Romance'] as const;
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

/** How the photo sits in the template. */
export type TemplateFrame = 'inset' | 'polaroid' | 'arch' | 'full' | 'neon';

export type TemplateDesign = {
  /** Background gradient, top-left → bottom-right. */
  background: readonly [string, string, ...string[]];
  frame: TemplateFrame;
  /** Small label above the caption. */
  kicker?: string;
  /** Default caption (editable). */
  caption: string;
  /** Literal Tailwind classes so they're visible at build time. */
  captionClass: string;
  kickerClass?: string;
  /** Emoji/glyph decorations scattered on the canvas. */
  decorations?: { glyph: string; className: string }[];
  /** Polaroid / card tilt in degrees. */
  tilt?: number;
  filter: FilterId;
};

export type Template = {
  id: string;
  title: string;
  description: string;
  ratio: '4:5' | '9:16' | '1:1';
  categories: TemplateCategory[];
  image: ImageSourcePropType;
  /** Card tint — [top-left, bottom-right]. */
  tint: readonly [string, string];
  design: TemplateDesign;
};

export const TEMPLATES: Template[] = [
  {
    id: 'editorial-glow',
    title: 'Editorial glow',
    description: 'Modern portrait',
    ratio: '4:5',
    categories: ['For you', 'Stylish'],
    image: require('../../assets/images/sections/templates/editorial.jpg'),
    tint: ['rgba(255, 79, 163, 0.30)', 'rgba(168, 85, 247, 0.22)'],
    design: {
      background: ['#2B0A26', '#14081F', '#08070C'],
      frame: 'inset',
      kicker: 'VELOURA · EDITORIAL',
      caption: 'Golden glow',
      kickerClass: 'text-primary-light tracking-[3px]',
      captionClass: 'font-extrabold text-white tracking-[-1px]',
      decorations: [{ glyph: '✦', className: 'right-[7%] top-[5%] text-primary-light' }],
      filter: 'bloom',
    },
  },
  {
    id: 'weekend-story',
    title: 'Weekend story',
    description: 'Fresh social',
    ratio: '9:16',
    categories: ['For you', 'Story', 'Social'],
    image: require('../../assets/images/sections/templates/weekend.jpg'),
    tint: ['rgba(45, 212, 191, 0.22)', 'rgba(96, 165, 250, 0.22)'],
    design: {
      background: ['#0F3B47', '#14234A', '#0B0F22'],
      frame: 'inset',
      kicker: 'SATURDAY',
      caption: 'Weekend mood ☀️',
      kickerClass: 'text-teal-300 tracking-[4px]',
      captionClass: 'font-extrabold text-white',
      decorations: [
        { glyph: '☁︎', className: 'left-[8%] top-[4%] text-white/40' },
        { glyph: '✺', className: 'right-[8%] top-[5%] text-amber-300' },
      ],
      filter: 'cool',
    },
  },
  {
    id: 'golden-hour',
    title: 'Golden hour',
    description: 'Warm memory',
    ratio: '1:1',
    categories: ['For you', 'Social'],
    image: require('../../assets/images/sections/templates/golden-hour.jpg'),
    tint: ['rgba(251, 146, 60, 0.28)', 'rgba(255, 79, 163, 0.20)'],
    design: {
      background: ['#F59E0B', '#F97316', '#DB2777'],
      frame: 'polaroid',
      caption: 'golden hour ✨',
      captionClass: 'font-bold text-stone-700',
      tilt: -3,
      filter: 'golden',
    },
  },
  {
    id: 'soft-romance',
    title: 'Soft romance',
    description: 'Elegant frame',
    ratio: '4:5',
    categories: ['For you', 'Romance'],
    image: require('../../assets/images/sections/templates/romance.jpg'),
    tint: ['rgba(255, 143, 209, 0.28)', 'rgba(192, 132, 252, 0.22)'],
    design: {
      background: ['#FBCFE8', '#F9A8D4', '#C084FC'],
      frame: 'arch',
      kicker: 'FOREVER',
      caption: 'Soft & sweet',
      kickerClass: 'text-rose-700/70 tracking-[4px]',
      captionClass: 'font-extrabold text-rose-900',
      decorations: [
        { glyph: '♥', className: 'left-[9%] top-[8%] text-rose-500' },
        { glyph: '♡', className: 'right-[10%] top-[16%] text-white' },
        { glyph: '♥', className: 'right-[7%] bottom-[24%] text-rose-400/70' },
      ],
      filter: 'bloom',
    },
  },
  {
    id: 'minimal-mood',
    title: 'Minimal mood',
    description: 'Clean layout',
    ratio: '1:1',
    categories: ['Stylish'],
    image: require('../../assets/images/sections/templates/minimal.jpg'),
    tint: ['rgba(196, 181, 253, 0.24)', 'rgba(129, 140, 248, 0.18)'],
    design: {
      background: ['#F5F5F4', '#E7E5E4'],
      frame: 'inset',
      caption: 'less, but better',
      captionClass: 'font-medium text-stone-600 tracking-[1px]',
      filter: 'natural',
    },
  },
  {
    id: 'neon-nights',
    title: 'Neon nights',
    description: 'Bold color',
    ratio: '9:16',
    categories: ['Story', 'Stylish'],
    image: require('../../assets/images/sections/templates/neon.jpg'),
    tint: ['rgba(168, 85, 247, 0.32)', 'rgba(99, 102, 241, 0.22)'],
    design: {
      background: ['#12051F', '#08070C'],
      frame: 'neon',
      kicker: 'AFTER DARK',
      caption: 'NEON NIGHTS',
      kickerClass: 'text-secondary-light tracking-[5px]',
      captionClass: 'font-extrabold text-primary-light tracking-[4px]',
      decorations: [
        { glyph: '✦', className: 'left-[10%] bottom-[6%] text-secondary-light' },
        { glyph: '✧', className: 'right-[12%] top-[4%] text-primary-light' },
      ],
      filter: 'cool',
    },
  },
  {
    id: 'love-letter',
    title: 'Love letter',
    description: 'Dreamy blush',
    ratio: '4:5',
    categories: ['Romance'],
    image: require('../../assets/images/sections/templates/love-letter.jpg'),
    tint: ['rgba(244, 63, 94, 0.26)', 'rgba(255, 143, 209, 0.20)'],
    design: {
      background: ['#FFE4E6', '#FECDD3'],
      frame: 'polaroid',
      caption: 'with love ♡',
      captionClass: 'font-bold text-rose-700',
      tilt: 4,
      decorations: [
        { glyph: '♥', className: 'left-[8%] top-[6%] text-rose-400' },
        { glyph: '✉︎', className: 'right-[8%] bottom-[5%] text-rose-500/70' },
      ],
      filter: 'bloom',
    },
  },
  {
    id: 'feed-grid',
    title: 'Feed grid',
    description: 'Social crop',
    ratio: '1:1',
    categories: ['Social'],
    image: require('../../assets/images/sections/templates/feed.jpg'),
    tint: ['rgba(96, 165, 250, 0.24)', 'rgba(168, 85, 247, 0.20)'],
    design: {
      background: ['#1E1B4B', '#4C1D95'],
      frame: 'full',
      kicker: '@veloura',
      caption: 'new post ✨',
      kickerClass: 'text-white/70 tracking-[1px]',
      captionClass: 'font-extrabold text-white',
      filter: 'natural',
    },
  },
];

export const findTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);
