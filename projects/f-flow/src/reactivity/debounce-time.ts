import { FChannelOperator } from './types';

export function debounceTime(delay: number): FChannelOperator {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (callback) => {
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(), delay);
    };
  };
}
