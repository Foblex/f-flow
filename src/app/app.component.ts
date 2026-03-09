import { MatIconRegistry } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IS_BROWSER_PLATFORM } from '@foblex/m-render';
import { findScreenshotTarget, isScreenshotShortcut, takeScreenshot } from './take-screenshot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  host: {
    'ngSkipHydration': '',
  },
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _renderer = inject(Renderer2);
  private readonly _document = inject(DOCUMENT);
  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);
  private readonly _listeners: Array<() => void> = [];

  private _isTakingScreenshot = false;

  public ngOnInit(): void {
    this._setDefaultFontSetClass();
    //this._listenKeyboardShortcuts();
  }

  private _setDefaultFontSetClass(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  private _listenKeyboardShortcuts(): void {
    if (!this._isBrowser) {
      return;
    }

    this._listeners.push(
      this._renderer.listen(this._document, 'keydown', (event: KeyboardEvent) => {
        if (
          !isScreenshotShortcut(event) ||
          this._isTakingScreenshot ||
          this._shouldIgnoreShortcut(event)
        ) {
          return;
        }

        const target = findScreenshotTarget(this._document);
        if (!target) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        this._isTakingScreenshot = true;

        void takeScreenshot(target).finally(() => {
          this._isTakingScreenshot = false;
        });
      }),
    );
  }

  private _shouldIgnoreShortcut(event: KeyboardEvent): boolean {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const tagName = target.tagName.toLowerCase();

    return target.isContentEditable || ['input', 'textarea', 'select'].includes(tagName);
  }

  public ngOnDestroy(): void {
    this._listeners.forEach((dispose) => dispose());
    this._listeners.length = 0;
  }
}
