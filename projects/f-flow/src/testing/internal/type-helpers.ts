import { ElementRef, InputSignal, OutputEmitterRef, Signal, signal } from '@angular/core';

/**
 * Internal escape hatch for abstract Angular classes used as test doubles.
 *
 * Classes such as FNodeBase/FConnectionBase/FCanvasBase rely on Angular DI internals,
 * so they cannot be directly instantiated in pure tests. Keep casts isolated here.
 */
export function unsafeCast<T>(value: unknown): T {
  return value as T;
}

export function readonlySignal<T>(value: T): Signal<T> {
  return signal(value).asReadonly();
}

export function inputSignal<T>(value: T): InputSignal<T> {
  return unsafeCast<InputSignal<T>>(readonlySignal(value));
}

export function outputEmitterStub<T>(onEmit?: (value: T) => void): OutputEmitterRef<T> {
  const emitter = {
    emit(value: T): void {
      onEmit?.(value);
    },
  };

  return unsafeCast<OutputEmitterRef<T>>(emitter);
}

export function elementRef<T extends Element>(nativeElement: T): ElementRef<T> {
  return new ElementRef(nativeElement);
}
