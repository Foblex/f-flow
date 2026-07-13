import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _document = inject(DOCUMENT);
  private readonly _storageKey = 'theme';
  private readonly _current = signal<Theme>('light');

  public readonly current = this._current.asReadonly();

  constructor() {
    const saved = this._document.defaultView?.localStorage.getItem(this._storageKey);
    this.setTheme(saved === 'dark' ? 'dark' : 'light');
  }

  public setTheme(theme: Theme): void {
    if (theme === 'dark') {
      this._document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this._document.documentElement.removeAttribute('data-theme');
    }

    this._current.set(theme);
    this._document.defaultView?.localStorage.setItem(this._storageKey, theme);
  }
}
