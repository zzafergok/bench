import { useCallback, useMemo, useSyncExternalStore } from 'react';

const STORAGE_CHANGE_EVENT = 'bench_storage_change';

function notifyStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_CHANGE_EVENT, callback);
  };
}

export function useStorageString<T extends string>(
  key: string,
  fallback: T,
  isValid: (val: string) => val is T,
): [T, (next: T) => void] {
  const getSnapshot = useCallback((): T => {
    try {
      const val = localStorage.getItem(key);
      if (val !== null && isValid(val)) return val;
    } catch {}
    return fallback;
  }, [key, fallback, isValid]);

  const getServerSnapshot = useCallback((): T => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, next);
        notifyStorageChange();
      } catch {}
    },
    [key],
  );

  return [value, setValue];
}

export function useStorageBoolean(
  key: string,
  fallback: boolean,
): [boolean, (next: boolean) => void] {
  const getSnapshot = useCallback((): boolean => {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val === 'true';
    } catch {}
    return fallback;
  }, [key, fallback]);

  const getServerSnapshot = useCallback((): boolean => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: boolean) => {
      try {
        localStorage.setItem(key, String(next));
        notifyStorageChange();
      } catch {}
    },
    [key],
  );

  return [value, setValue];
}

export function useStorageJson<T>(
  key: string,
  fallback: T,
  isValid: (val: unknown) => val is T,
): [T, (updater: T | ((prev: T) => T)) => void] {
  const fallbackStr = useMemo(() => JSON.stringify(fallback), [fallback]);

  const getSnapshot = useCallback((): string => {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) {
        const parsed: unknown = JSON.parse(val);
        if (isValid(parsed)) return val;
      }
    } catch {}
    return fallbackStr;
  }, [key, fallbackStr, isValid]);

  const getServerSnapshot = useCallback(
    (): string => fallbackStr,
    [fallbackStr],
  );

  const rawJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const parsedValue = useMemo((): T => {
    try {
      const parsed: unknown = JSON.parse(rawJson);
      if (isValid(parsed)) return parsed;
    } catch {}
    return fallback;
  }, [rawJson, isValid, fallback]);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      try {
        let nextValue: T;
        if (typeof updater === 'function') {
          const current: unknown = JSON.parse(
            localStorage.getItem(key) ?? fallbackStr,
          );
          const validCurrent = isValid(current) ? current : fallback;
          nextValue = (updater as (prev: T) => T)(validCurrent);
        } else {
          nextValue = updater;
        }
        localStorage.setItem(key, JSON.stringify(nextValue));
        notifyStorageChange();
      } catch {}
    },
    [key, fallback, fallbackStr, isValid],
  );

  return [parsedValue, setValue];
}
