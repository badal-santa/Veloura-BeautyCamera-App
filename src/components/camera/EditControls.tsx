import type { SkImage } from '@shopify/react-native-skia';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { EditControlsState } from '../../features/beauty/useEditState';
import type { BeautyKey, EditMode } from '../../features/beauty/types';
import AdjustPanel from './AdjustPanel';
import BeautyPanel from './BeautyPanel';
import FilterPanel from './FilterPanel';
import ModeSwitcher from './ModeSwitcher';

type Props = EditControlsState & {
  filterSample: SkImage | null;
  onBeforeChange?: (showOriginal: boolean) => void;
  /** Adds a Crop tab showing this panel. */
  cropPanel?: ReactNode;
  /** Adds a Makeup tab showing this panel. */
  makeupPanel?: ReactNode;
  /** Controlled mode (optional) — lets the parent react to the Crop tab. */
  mode?: EditMode;
  onModeChange?: (mode: EditMode) => void;
};

/** Beauty / Filters / Adjust (/ Crop) controls shared by the camera and the photo review. */
export default function EditControls({
  edit,
  setBeauty,
  setFilter,
  setExposure,
  resetBeauty,
  filterSample,
  onBeforeChange,
  cropPanel,
  makeupPanel,
  mode: controlledMode,
  onModeChange,
}: Props) {
  const [ownMode, setOwnMode] = useState<EditMode>('beauty');
  const mode = controlledMode ?? ownMode;
  const setMode = onModeChange ?? setOwnMode;
  const [tool, setTool] = useState<BeautyKey>('smooth');

  const modes: EditMode[] = [
    'beauty',
    ...(makeupPanel ? (['makeup'] as const) : []),
    'filters',
    'adjust',
    ...(cropPanel ? (['crop'] as const) : []),
  ];

  return (
    <View>
      <Animated.View key={mode} entering={FadeIn.duration(200)} className="min-h-[96px] justify-center">
        {mode === 'beauty' && (
          <BeautyPanel
            beauty={edit.beauty}
            tool={tool}
            onToolChange={setTool}
            onChange={setBeauty}
            onReset={resetBeauty}
            onBeforeChange={onBeforeChange}
          />
        )}
        {mode === 'filters' && (
          <FilterPanel selected={edit.filter} onSelect={setFilter} sample={filterSample} />
        )}
        {mode === 'adjust' && <AdjustPanel exposure={edit.exposure} onChange={setExposure} />}
        {mode === 'crop' && cropPanel}
        {mode === 'makeup' && makeupPanel}
      </Animated.View>

      <View className="mt-3">
        <ModeSwitcher modes={modes} mode={mode} onChange={setMode} />
      </View>
    </View>
  );
}
