import { useCallback, useRef, useState } from 'react';

const LIMIT = 50;
/** Changes with the same group key inside this window merge into one undo step. */
const MERGE_MS = 700;

type Entry<T> = { past: T[]; present: T; future: T[] };

/**
 * Undo/redo state. Rapid changes from the same control (e.g. a slider drag)
 * collapse into a single step when they share a `group` key.
 */
export function useHistory<T>(initial: T) {
  const [h, setH] = useState<Entry<T>>({ past: [], present: initial, future: [] });
  const last = useRef<{ group?: string; at: number }>({ at: 0 });

  const set = useCallback((update: (prev: T) => T, group?: string) => {
    const now = Date.now();
    const merge = group != null && last.current.group === group && now - last.current.at < MERGE_MS;
    last.current = { group, at: now };
    setH((cur) => {
      const next = update(cur.present);
      if (Object.is(next, cur.present)) return cur;
      return merge
        ? { past: cur.past, present: next, future: [] }
        : { past: [...cur.past, cur.present].slice(-LIMIT), present: next, future: [] };
    });
  }, []);

  /** Change the current state without creating an undo step (e.g. initial setup). */
  const replace = useCallback((update: (prev: T) => T) => {
    setH((cur) => ({ ...cur, present: update(cur.present) }));
  }, []);

  const undo = useCallback(() => {
    last.current = { at: 0 };
    setH((cur) =>
      cur.past.length === 0
        ? cur
        : { past: cur.past.slice(0, -1), present: cur.past[cur.past.length - 1], future: [cur.present, ...cur.future] },
    );
  }, []);

  const redo = useCallback(() => {
    last.current = { at: 0 };
    setH((cur) =>
      cur.future.length === 0
        ? cur
        : { past: [...cur.past, cur.present], present: cur.future[0], future: cur.future.slice(1) },
    );
  }, []);

  return {
    state: h.present,
    set,
    replace,
    undo,
    redo,
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
  };
}
