import { useCallback, useRef, useEffect } from 'react';
import { debounce } from '../lib/utils';
import { AUTOSAVE_DELAY } from '../lib/constants';

export function useAutoSave<T>(
  saveFunction: (data: T) => Promise<void>,
  delay: number = AUTOSAVE_DELAY
) {
  const saveRef = useRef(saveFunction);

  useEffect(() => {
    saveRef.current = saveFunction;
  }, [saveFunction]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((data: T) => {
      saveRef.current(data);
    }, delay),
    [delay]
  );

  return debouncedSave;
}
