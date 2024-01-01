import { useCallback, useState, useSyncExternalStore } from 'react';
import { StorageType } from '../interface';
import { getStorage } from '../utils';

export const useStorage = <T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local',
): [T, (value: T) => void] => {
  const storage = getStorage(storageType);

  // 실시간 로컬 상태를 관리하기 위함
  const [localValue, setLocalValue] = useState<T>(() => {
    const item = storage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : initialValue;
  });

  // 로컬 상태 값을 반환하는
  const getSnapshot = useCallback((): T => {
    return localValue;
  }, [localValue]);

  // 외부 저장소의 변경을 감지하기 위한 함수, 외부탭에서 변경해야만 동작.
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const listener = (e: StorageEvent) => {
        if (e.key === key) {
          const newValue =
            e.newValue !== null ? (JSON.parse(e.newValue) as T) : initialValue;
          setLocalValue(newValue);
          onStoreChange(); // Inform React to re-render the component
        }
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
    [initialValue, key],
  );

  // useSyncExternalStore를 사용하여 외부 저장소의 상태를 동기화
  const storageValue = useSyncExternalStore(subscribe, getSnapshot);

  const setValue = useCallback(
    (newValue: T) => {
      storage.setItem(key, JSON.stringify(newValue));
      setLocalValue(newValue);
    },
    [key, storage],
  );

  return [storageValue, setValue]; // 현재 값과 값을 설정하는 함수를 반환합니다.
};
