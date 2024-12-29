import { FChannelOperator } from './types';

export function debounceTime(delay: number): FChannelOperator {
  let timeoutId: any;
  return callback => {
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(), delay);
    };
  };
}
