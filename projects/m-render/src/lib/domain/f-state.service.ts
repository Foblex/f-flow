import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BrowserService } from '@foblex/platform';

@Injectable({ providedIn: 'root' })
export class FStateService {

  private theme: Subject<void> = new Subject<void>();

  constructor(
    private fBrowser: BrowserService
  ) {
  }

  public get theme$(): Observable<void> {
    return this.theme.asObservable();
  }

  public updateTheme(): void {
    this.theme.next();
  }

  public getPreferredTheme(): string {
    return this.fBrowser.localStorage.getItem('preferred-theme')
      || (this.fBrowser.window.isMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light');
  }
}
