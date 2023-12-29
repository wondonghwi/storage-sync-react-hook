import { StorageType } from '../interface';

export const getStorage = (storageType: StorageType): Storage =>
  storageType === 'local' ? localStorage : sessionStorage;
