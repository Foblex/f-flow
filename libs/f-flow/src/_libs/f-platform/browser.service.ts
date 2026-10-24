import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { F_WINDOW, IWindowService } from './window';
import { F_LOCAL_STORAGE, ILocalStorage } from './local-storage';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class BrowserService {
  private readonly _document = inject(DOCUMENT);
  private readonly _windowService = inject(F_WINDOW);
  private readonly _localStorageService = inject(F_LOCAL_STORAGE);
  private readonly _platformService = inject(PlatformService);

  public isBrowser(): boolean {
    return this._platformService.isBrowser;
  }

  public get window(): IWindowService {
    return this._windowService;
  }

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public get localStorage(): ILocalStorage {
    return this._localStorageService;
  }

  public get document(): Document {
    return this._document;
  }

  public toPixels(
    value: string,
    clientWidth: number,
    clientHeight: number,
    fontSize: string,
  ): number {
    if (value.endsWith('px')) {
      return parseFloat(value);
    } else if (value.endsWith('%')) {
      const percentage = parseFloat(value) / 100;

      return Math.max(clientWidth, clientHeight) * percentage;
    } else if (value.endsWith('em')) {
      return parseFloat(value) * parseFloat(fontSize);
    } else if (value.endsWith('rem')) {
      return (
        parseFloat(value) * parseFloat(getComputedStyle(this.document.documentElement).fontSize)
      );
    } else if (value.endsWith('vh')) {
      const vh = this.window.innerHeight / 100;

      return parseFloat(value) * vh;
    } else if (value.endsWith('vw')) {
      const vw = this.window.innerWidth / 100;

      return parseFloat(value) * vw;
    }

    return parseFloat(value) || 0;
  }
}
