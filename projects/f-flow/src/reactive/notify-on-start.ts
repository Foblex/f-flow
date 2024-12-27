import { FChannelOperator } from '@foblex/flow';

export function notifyOnStart(): FChannelOperator {
  return callback => {
    callback();
    return callback;
  };
}
