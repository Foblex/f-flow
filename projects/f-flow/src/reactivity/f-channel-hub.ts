import { FChannel } from './f-channel';
import { FChannelListener, FChannelOperator } from './types';
import { DestroyRef } from '@angular/core';

export class FChannelHub {

  private readonly _channels: FChannel[] = [];

  private _operators: FChannelOperator[] = [];

  constructor(...channels: FChannel[]) {
    this._channels = [...channels];
  }

  public pipe(...operators: FChannelOperator[]): FChannelHub {
    const result = new FChannelHub(...this._channels);
    result._operators = [...this._operators, ...operators];

    return result;
  }

  public listen(destroyRef: DestroyRef, callback: FChannelListener): void {
    let modifiedCallback = callback;

    this._operators.forEach(operator => {
      modifiedCallback = operator(modifiedCallback);
    });

    const unsubscribeCallbacks = this._channels.map(channel =>
      channel.listen(() => modifiedCallback()),
    );

    destroyRef.onDestroy(() => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    });
  }
}
