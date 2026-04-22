import {
  ChangeDetectionStrategy,
  Component,
  HostListener, inject, OnInit,
  Renderer2,
} from '@angular/core';
import { ThemeService } from '../theme.service';
import { DOCUMENT_ELEMENT, IS_BROWSER_PLATFORM, LOCAL_STORAGE } from '../../common';

@Component({
  selector: 'button[theme-button]',
  templateUrl: './theme-button.component.html',
  styleUrls: [ './theme-button.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeButtonComponent implements OnInit {
  private readonly _renderer = inject(Renderer2);
  private readonly _themeService = inject(ThemeService, { optional: true });
  private readonly _localStorage = inject(LOCAL_STORAGE);
  private readonly _documentElement = inject(DOCUMENT_ELEMENT);
  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);

  public ngOnInit(): void {
    if(!this._themeService && this._isBrowser) {
      throw new Error('Theme is not provided. Please provide it using provideTheme() provider in your application config.');
    }
  }
  private _isDocumentContainsDarkTheme(): boolean {
    return this._documentElement.classList.contains('dark');
  }

  @HostListener('click')
  protected _onClick(): void {
    if (this._themeService?.getPreferredTheme() === 'light' && !this._isDocumentContainsDarkTheme()) {
      this._renderer.addClass(this._documentElement, 'dark');
      this._localStorage.setItem('preferred-theme', 'dark');
    } else {
      this._renderer.removeClass(this._documentElement, 'dark');
      this._localStorage.setItem('preferred-theme', 'light');
    }
    this._themeService?.updateTheme();
  }
}
