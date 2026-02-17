import { FChannelOperator } from './types';

// export function notifyOnStart(): FChannelOperator {
//   return (callback) => {
//     let teardown: (() => void) | null = null;
//
//     return {
//       setTeardown: (t) => (teardown = t),
//       callback,
//       onSubscribe: (finalCallback) => {
//         if (!teardown) return;
//         finalCallback();
//       },
//     };
//   };
// }
export function notifyOnStart(): FChannelOperator {
  return (callback) => {
    let active = true;

    return {
      callback,
      onSubscribe: (finalCallback) => {
        queueMicrotask(() => {
          if (!active) return;
          finalCallback();
        });
      },
      cleanup: () => {
        active = false;
      },
    };
  };
}
