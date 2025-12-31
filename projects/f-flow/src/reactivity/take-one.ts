import { FChannelOperator } from './types';

export function takeOne(): FChannelOperator {
  return (callback) => {
    let taken = false;
    let teardown: (() => void) | null = null;

    return {
      setTeardown: (t) => (teardown = t),
      callback: () => {
        if (taken) return;
        taken = true;

        callback();
        teardown?.();
      },
    };
  };
}
