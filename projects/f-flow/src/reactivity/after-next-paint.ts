import { FChannelOperator } from './types';

export function afterNextPaint(): FChannelOperator {
  return (callback) => {
    let raf1: number | null = null;
    let raf2: number | null = null;

    const cancel = () => {
      if (raf1 !== null) cancelAnimationFrame(raf1);
      if (raf2 !== null) cancelAnimationFrame(raf2);
      raf1 = raf2 = null;
    };

    return {
      callback: () => {
        cancel();
        raf1 = requestAnimationFrame(() => {
          raf1 = null;
          raf2 = requestAnimationFrame(() => {
            raf2 = null;
            callback();
          });
        });
      },
      cleanup: cancel,
    };
  };
}
