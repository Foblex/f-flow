import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _storageKey = 'theme';

  constructor() {
    const saved = localStorage.getItem(this._storageKey) as 'light' | 'dark' | null;
    this.setTheme(saved ?? 'light');
  }

  public get current(): 'light' | 'dark' {
    return (document.documentElement.getAttribute('data-theme') as 'dark' | null)
      ? 'dark'
      : 'light';
  }

  public toggle(theme: 'light' | 'dark'): void {
    this.setTheme(theme);
  }

  public setTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(this._storageKey, theme);
  }
}
