import { useCallback } from 'react';
import { StorageType } from '../interface';
import { getStorage } from '../utils';

export const useSetStorage = <T>(
  key: string,
  storageType: StorageType = 'local',
): ((value: T) => void) => {
  const storage = getStorage(storageType);

  const setStorageValue = useCallback(
    (newValue: T) => {
      storage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(new CustomEvent('storage-change', { detail: key }));
    },
    [key, storage],
  );

  return setStorageValue;
};
