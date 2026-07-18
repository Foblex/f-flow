import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type CampaignThemeValue = 'light' | 'dark';

const STORAGE_KEY = 'foblex-campaign-studio-theme';

@Injectable({ providedIn: 'root' })
export class CampaignTheme {
  private readonly _document = inject(DOCUMENT);
  private readonly _current = signal<CampaignThemeValue>('light');

  public readonly current = this._current.asReadonly();

  constructor() {
    const saved = this._document.defaultView?.localStorage.getItem(STORAGE_KEY);
    this.set(saved === 'dark' ? 'dark' : 'light');
  }

  public toggle(): void {
    this.set(this._current() === 'light' ? 'dark' : 'light');
  }

  public set(theme: CampaignThemeValue): void {
    this._document.documentElement.toggleAttribute('data-campaign-theme-dark', theme === 'dark');
    this._current.set(theme);
    this._document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
  }
}
