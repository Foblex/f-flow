import { FChannelOperator } from './types';

export function debounceMicrotask(): FChannelOperator {
  return (callback) => {
    let scheduled = false;

    return {
      callback: () => {
        if (scheduled) return;
        scheduled = true;

        queueMicrotask(() => {
          scheduled = false;
          callback();
        });
      },
      cleanup: () => {
        scheduled = false;
      },
    };
  };
}
