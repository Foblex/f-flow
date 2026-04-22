import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DOCUMENT_ELEMENT, LOCAL_STORAGE, WINDOW } from '../common';

@Injectable()
export class ThemeService {
  private readonly _localStorage = inject(LOCAL_STORAGE, { optional: true });
  private readonly _window = inject(WINDOW, { optional: true });
  private readonly _theme = new Subject<void>();
  private readonly _docElement = inject(DOCUMENT_ELEMENT);

  public get theme$(): Observable<void> {
    return this._theme.asObservable();
  }

  public initialize(): void {
    if (this.getPreferredTheme() === 'dark' && !this._isDocumentContainsDarkTheme()) {
      this._docElement.classList.add('dark');
      this._localStorage?.setItem('preferred-theme', 'dark');
    }
  }

  public updateTheme(): void {
    this._theme.next();
  }

  public getPreferredTheme(): string {
    return this._getItem('preferred-theme')
      || (this._matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light');
  }

  private _getItem(key: string): string | null {
    return this._localStorage?.getItem?.(key) || null;
  }

  private _matchMedia(query: string): MediaQueryList {
    return this._window?.matchMedia?.(query) || { matches: false } as MediaQueryList;
  }

  private _isDocumentContainsDarkTheme(): boolean {
    return this._docElement.classList.contains('dark');
  }
}
