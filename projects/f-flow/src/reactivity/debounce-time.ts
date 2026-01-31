import { FChannelOperator } from './types';

export function debounceTime(delay: number): FChannelOperator {
  return (callback) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return {
      callback: () => {
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          timeoutId = null;
          callback();
        }, delay);
      },
      cleanup: () => {
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = null;
      },
    };
  };
}
