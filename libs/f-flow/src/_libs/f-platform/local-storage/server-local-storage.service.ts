import { Injectable } from '@angular/core';
import { ILocalStorage } from './i-local-storage';

/**
 * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
 */
@Injectable({ providedIn: 'root' })
export class ServerLocalStorageService implements ILocalStorage {
  private _storage: Record<string, string> = {};

  setItem(key: string, value: string): void {
    this._storage[key] = value;
  }

  getItem(key: string): string | null {
    return this._storage[key] || null;
  }

  removeItem(key: string): void {
    delete this._storage[key];
  }

  clear(): void {
    this._storage = {};
  }
}
