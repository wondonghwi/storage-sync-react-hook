import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { StorageType } from '../interface';
import { getStorage } from '../utils';

export const useStorage = <T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local',
): [T, (value: T) => void] => {
  const storage = getStorage(storageType);

  const getLocalStorageValue = useCallback((): T => {
    const item = storage.getItem(key);
    return item !== null ? JSON.parse(item) : initialValue;
  }, [key, initialValue, storage]);

  const [storageValue, setStorageValue] = useState<T>(getLocalStorageValue);

  const subscribe = useCallback(
    (callback: () => void): (() => void) => {
      const listener = (e: StorageEvent): void => {
        if (e.key === key) {
          callback();
        }
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
    [key],
  );

  const externalState = useSyncExternalStore(subscribe, getLocalStorageValue);

  useEffect(() => {
    setStorageValue(externalState);
  }, [externalState]);

  const setValue = useCallback(
    (newValue: T): void => {
      storage.setItem(key, JSON.stringify(newValue));
      setStorageValue(newValue);
    },
    [key, storage],
  );

  return [storageValue, setValue];
};
