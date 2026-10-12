import { useSyncExternalStore } from 'react';

import { readJSON, writeJSON } from './storage';

/** Tiny persisted global store (JSON file in app documents). */
export function createPersistedStore<T extends object>(file: string, defaults: T) {
  let state: T = { ...defaults, ...readJSON<Partial<T>>(file, {}) };
  const listeners = new Set<() => void>();

  const get = () => state;
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const set = (next: Partial<T> | ((s: T) => T)) => {
    state = typeof next === 'function' ? next(state) : { ...state, ...next };
    writeJSON(file, state);
    listeners.forEach((l) => l());
  };
  const reset = () => set(() => ({ ...defaults }));
  const use = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, reset, subscribe, use };
}
