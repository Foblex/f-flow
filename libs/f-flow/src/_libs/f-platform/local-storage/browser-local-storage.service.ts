import { Injectable } from '@angular/core';
import { ILocalStorage } from './i-local-storage';

/**
 * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
 */
@Injectable({ providedIn: 'root' })
export class BrowserLocalStorageService implements ILocalStorage {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
