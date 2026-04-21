import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  private readonly _message = signal<string | null>(null);

  public get message(): Signal<string | null> {
    return this._message.asReadonly();
  }

  public show(message: string, timeout = 2000): void {
    this._message.set(message);
    setTimeout(() => this._message.set(null), timeout);
  }
}
