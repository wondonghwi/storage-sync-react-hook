import React from 'react';
import { useStorage } from '../hooks/useStorage';
import { useStorageValue } from '../hooks/useStorageValue';
import { useSetStorage } from '../hooks/useSetStorage';

const MyComponent = () => {
  const [value, setValue] = useStorage<string>('myKey', '');
  const values = useStorageValue<string>('yourKey', '');
  const setValues = useSetStorage<string>('yourKey');

  return (
    <div>
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>LocalStorage Value: {value}</p>
      <input
        type='text'
        value={values}
        onChange={(e) => setValues(e.target.value)}
      />
      <p>LocalStorage Values: {values}</p>
    </div>
  );
};

export default MyComponent;
