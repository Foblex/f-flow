import { FChannelOperator } from './types';

export function notifyOnStart(): FChannelOperator {
  return callback => {
    callback();

    return callback;
  };
}
