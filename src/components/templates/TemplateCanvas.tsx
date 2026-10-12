import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef } from 'react';
import { Text, View } from 'react-native';

import type { Template } from '../../data/templates';
import { templateLayout } from '../../features/templates/layout';
import PhotoSlot, { type Pan } from './PhotoSlot';

type Props = {
  template: Template;
  width: number;
  height: number;
  photo: { uri: string; width: number; height: number } | null;
  zoom: number;
  pan: Pan;
  onPanChange?: (pan: Pan) => void;
  caption: string;
  frozenUri?: string;
  onFrozenLoad?: () => void;
};

/** A template rendered with the user's photo — plain views, so it can be snapshotted for export. */
const TemplateCanvas = forwardRef<View, Props>(function TemplateCanvas(
  { template, width, height, photo, zoom, pan, onPanChange, caption, frozenUri, onFrozenLoad },
  ref,
) {
  const d = template.design;
  const L = templateLayout(d.frame, width, height);
  const tilt = d.tilt ? [{ rotate: `${d.tilt}deg` }] : undefined;

  return (
    // Size comes from runtime layout, so it's an inline style.
    <View ref={ref} collapsable={false} className="overflow-hidden" style={{ width, height }}>
      <LinearGradient colors={d.background} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

      {/* Polaroid card + tilt wrapper */}
      <View className="absolute inset-0" style={{ transform: tilt }}>
        {L.card && (
          <View
            className="absolute bg-white shadow-xl shadow-black/40"
            style={{ left: L.card.x, top: L.card.y, width: L.card.width, height: L.card.height, borderRadius: L.radius }}
          />
        )}

        {d.frame === 'neon' && (
          <View
            className="absolute border-2 border-primary"
            style={{
              left: L.photo.x - 6,
              top: L.photo.y - 6,
              width: L.photo.width + 12,
              height: L.photo.height + 12,
              borderRadius: L.radius + 6,
              boxShadow: '0 0 18px #FF4FA3, inset 0 0 12px rgba(255, 79, 163, 0.6)',
            }}
          />
        )}

        {photo ? (
          <PhotoSlot
            uri={photo.uri}
            imageWidth={photo.width}
            imageHeight={photo.height}
            rect={L.photo}
            zoom={zoom}
            pan={pan}
            onPanChange={onPanChange}
            frozenUri={frozenUri}
            onFrozenLoad={onFrozenLoad}
            arch={d.frame === 'arch'}
            radius={L.radius}
            className={d.frame === 'inset' ? 'border border-white/20' : d.frame === 'arch' ? 'border-4 border-white/70' : ''}
          />
        ) : (
          <View
            className="absolute bg-black/20"
            style={{ left: L.photo.x, top: L.photo.y, width: L.photo.width, height: L.photo.height, borderRadius: L.radius }}
          />
        )}

        {d.frame === 'full' && (
          <LinearGradient
            colors={['transparent', 'rgba(8, 7, 12, 0.75)']}
            locations={[0.5, 1]}
            className="absolute inset-0"
            pointerEvents="none"
          />
        )}

        {/* Caption */}
        <View
          pointerEvents="none"
          className={`absolute justify-center ${L.textAlign === 'center' ? 'items-center' : 'items-start'}`}
          style={{ left: L.text.x, top: L.text.y, width: L.text.width, height: L.text.height }}
        >
          {d.kicker && (
            <Text className={`font-bold ${d.kickerClass ?? ''}`} style={{ fontSize: L.kickerSize }}>
              {d.kicker}
            </Text>
          )}
          <Text
            numberOfLines={2}
            className={`${d.captionClass} ${L.textAlign === 'center' ? 'text-center' : ''}`}
            style={{ fontSize: L.captionSize, lineHeight: L.captionSize * 1.15, marginTop: d.kicker ? L.kickerSize * 0.6 : 0 }}
          >
            {caption}
          </Text>
        </View>
      </View>

      {d.decorations?.map((dec, i) => (
        <Text key={i} pointerEvents="none" className={`absolute ${dec.className}`} style={{ fontSize: width * 0.07 }}>
          {dec.glyph}
        </Text>
      ))}
    </View>
  );
});

export default TemplateCanvas;
