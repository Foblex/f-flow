import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  private readonly _message = signal<string | null>(null);
  private _messageTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public get message(): Signal<string | null> {
    return this._message.asReadonly();
  }

  public show(message: string, timeout = 2000): void {
    if (this._messageTimeoutId !== null) {
      clearTimeout(this._messageTimeoutId);
    }

    this._message.set(message);
    this._messageTimeoutId = setTimeout(() => {
      this._message.set(null);
      this._messageTimeoutId = null;
    }, timeout);
  }
}
