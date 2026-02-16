import { FChannelOperator } from './types';

export function debounceAnimationFrame(): FChannelOperator {
  return (callback) => {
    let rafId: number | null = null;

    return {
      callback: () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          callback();
        });
      },
      cleanup: () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      },
    };
  };
}
