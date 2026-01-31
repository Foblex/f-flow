export type Unsubscribe = () => void;

export interface SubscribeOptions<T> {
  debounceMs?: number;
  throttleMs?: number;
  distinct?: (a: T, b: T) => boolean; // true => одинаково, не эмитим
  once?: boolean;

  /**
   * Если true — вызвать listener сразу при подписке:
   * - если уже есть lastValue (после notify) — отдаст его
   * - иначе, если задан startWith — отдаст startWith
   * - иначе ничего не вызовет
   */
  notifyOnStart?: boolean;

  /** Стартовое значение, если notifyOnStart=true, а notify() ещё не было */
  startWith?: T;
}

export class Notifier<T> {
  private readonly _listeners = new Set<(value: T) => void>();

  private _hasLast = false;
  private _lastValue!: T;

  public notify(value: T): void {
    this._hasLast = true;
    this._lastValue = value;

    for (const l of this._listeners) l(value);
  }

  public subscribe(listener: (value: T) => void, options: SubscribeOptions<T> = {}): Unsubscribe {
    const wrapped = this._wrap(listener, options);
    this._listeners.add(wrapped);

    if (options.notifyOnStart) {
      const shouldEmitStart = this._hasLast || 'startWith' in options;
      if (shouldEmitStart) {
        const startValue = this._hasLast ? this._lastValue : options.startWith!;
        queueMicrotask(() => {
          if (this._listeners.has(wrapped)) wrapped(startValue);
        });
      }
    }

    return () => this._listeners.delete(wrapped);
  }

  private _wrap(listener: (value: T) => void, o: SubscribeOptions<T>): (value: T) => void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastEmitAt = 0;

    let hasLastLocal = false;
    let lastLocal!: T;

    const emit = (v: T) => {
      if (o.distinct && hasLastLocal && o.distinct(lastLocal, v)) return;

      hasLastLocal = true;
      lastLocal = v;

      listener(v);

      if (o.once) {
        this._listeners.delete(handler);
      }
    };

    const handler = (v: T) => {
      if (o.throttleMs != null) {
        const now = Date.now();
        if (now - lastEmitAt < o.throttleMs) return;
        lastEmitAt = now;
        emit(v);

        return;
      }

      if (o.debounceMs != null) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => emit(v), o.debounceMs);

        return;
      }

      emit(v);
    };

    return handler;
  }
}
