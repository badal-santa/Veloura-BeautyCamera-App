import { useCallback, useMemo, useState } from 'react';

import { DEFAULT_EDIT, type BeautyKey, type EditState, type FilterId } from './types';

type Update = (fn: (e: EditState) => EditState, group?: string) => void;

/** Edit actions on top of any state container (plain state or undo history). */
export function makeEditActions(update: Update) {
  return {
    setBeauty: (key: BeautyKey, value: number) =>
      update((e) => ({ ...e, beauty: { ...e.beauty, [key]: value } }), `beauty.${key}`),
    setFilter: (filter: FilterId) => update((e) => ({ ...e, filter })),
    setExposure: (exposure: number) => update((e) => ({ ...e, exposure }), 'exposure'),
    resetBeauty: (key: BeautyKey) => update((e) => ({ ...e, beauty: { ...e.beauty, [key]: 0 } })),
  };
}

export type EditControlsState = { edit: EditState } & ReturnType<typeof makeEditActions>;

export function useEditState(initial: EditState = DEFAULT_EDIT): EditControlsState {
  const [edit, setEdit] = useState<EditState>(initial);
  const update = useCallback<Update>((fn) => setEdit(fn), []);
  const actions = useMemo(() => makeEditActions(update), [update]);
  return { edit, ...actions };
}
