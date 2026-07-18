import { DestroyRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { debounceTime } from './debounce-time';
import { FChannel } from './f-channel';
import { FChannelHub } from './f-channel-hub';

class ManualDestroyRef extends DestroyRef {
  private _destroyed = false;

  private readonly _callbacks = new Set<() => void>();

  public override get destroyed(): boolean {
    return this._destroyed;
  }

  public override onDestroy(callback: () => void): () => void {
    if (this._destroyed) {
      throw new Error('NG0911');
    }

    this._callbacks.add(callback);

    return () => this._callbacks.delete(callback);
  }

  public beginDestroy(): void {
    this._destroyed = true;
  }

  public runDestroyCallbacks(): void {
    this.beginDestroy();
    [...this._callbacks].forEach((callback) => callback());
    this._callbacks.clear();
  }
}

describe('FChannelHub', () => {
  it('should ignore notifications after view destruction starts', () => {
    const channel = new FChannel();
    const destroyRef = new ManualDestroyRef();
    const callback = jasmine.createSpy('callback');

    new FChannelHub(channel).listen(destroyRef, callback);
    destroyRef.beginDestroy();
    channel.notify();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not register a listener for an already destroyed view', () => {
    const channel = new FChannel();
    const destroyRef = new ManualDestroyRef();
    const callback = jasmine.createSpy('callback');
    destroyRef.beginDestroy();

    expect(() => new FChannelHub(channel).listen(destroyRef, callback)).not.toThrow();
    channel.notify();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should drop delayed notifications while destroy callbacks are still pending', fakeAsync(() => {
    const channel = new FChannel();
    const destroyRef = new ManualDestroyRef();
    const callback = jasmine.createSpy('callback');

    new FChannelHub(channel).pipe(debounceTime(10)).listen(destroyRef, callback);
    channel.notify();
    destroyRef.beginDestroy();
    tick(10);

    expect(callback).not.toHaveBeenCalled();
  }));

  it('should unsubscribe channels when destroy callbacks run', () => {
    const channel = new FChannel();
    const destroyRef = new ManualDestroyRef();
    const callback = jasmine.createSpy('callback');

    new FChannelHub(channel).listen(destroyRef, callback);
    destroyRef.runDestroyCallbacks();
    channel.notify();

    expect(callback).not.toHaveBeenCalled();
  });
});
