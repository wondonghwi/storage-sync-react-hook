import { useState, useEffect } from 'react';
import { StorageType } from '../interface';
import { getStorage } from '../utils';

export const useStorageValue = <T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local',
): T => {
  const storage = getStorage(storageType);

  const [value, setValue] = useState<T>(() => {
    const item = storage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = (event: Event): void => {
      if (event instanceof CustomEvent && event.detail === key) {
        const newValue = storage.getItem(key);
        setValue(newValue ? (JSON.parse(newValue) as T) : initialValue);
      }
    };

    window.addEventListener(
      'storage-change',
      handleStorageChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        'storage-change',
        handleStorageChange as EventListener,
      );
    };
  }, [key, initialValue, storage]);

  return value;
};
