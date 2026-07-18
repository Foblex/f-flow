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
    let tornDown = false;
    let current = () => {
      if (tornDown || destroyRef.destroyed) {
        return;
      }

      callback();
    };

    const cleanups: (() => void)[] = [];
    const onSubscribes: ((finalCb: FChannelListener) => void)[] = [];
    const teardownSetters: ((teardown: () => void) => void)[] = [];

    for (const operator of [...this._operators].reverse()) {
      const res = operator(current);
      current = res.callback;

      if (res.cleanup) cleanups.push(res.cleanup);
      if (res.onSubscribe) onSubscribes.push(res.onSubscribe);
      if (res.setTeardown) teardownSetters.push(res.setTeardown);
    }

    const unsubs: (() => void)[] = [];
    let unregisterOnDestroy: (() => void) | null = null;
    const teardown = () => {
      if (tornDown) return;
      tornDown = true;

      unregisterOnDestroy?.();
      unregisterOnDestroy = null;

      unsubs.forEach((u) => u());
      cleanups.forEach((c) => c());
    };

    teardownSetters
      .slice()
      .reverse()
      .forEach((set) => set(teardown));

    if (destroyRef.destroyed) {
      teardown();

      return;
    }

    this._channels.forEach((channel) => {
      unsubs.push(
        channel.listen(() => {
          if (tornDown || destroyRef.destroyed) {
            return;
          }

          current();
        }),
      );
    });

    if (destroyRef.destroyed) {
      teardown();

      return;
    }

    unregisterOnDestroy = destroyRef.onDestroy(teardown);

    onSubscribes
      .slice()
      .reverse()
      .forEach((fn) => {
        if (!tornDown && !destroyRef.destroyed) {
          fn(current);
        }
      });
  }
}
