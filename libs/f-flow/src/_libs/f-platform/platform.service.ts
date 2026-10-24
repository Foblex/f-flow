import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EOperationSystem } from './e-operation-system';

let hasV8BreakIterator: boolean;

try {
  hasV8BreakIterator =
    typeof Intl !== 'undefined' &&
    !!(Intl as unknown as { v8BreakIterator?: unknown }).v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}

/* eslint-disable @typescript-eslint/naming-convention --
 * The upper-case browser flags are the published @foblex/platform API surface;
 * they keep their names after being vendored into @foblex/flow. */
@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly _platformId = inject(PLATFORM_ID);

  public isBrowser: boolean = this._platformId
    ? isPlatformBrowser(this._platformId)
    : typeof document === 'object' && !!document;

  /**
   * Detects only the discontinued legacy EdgeHTML browser (modern Edge reports `Edg/`).
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public EDGE: boolean = this.isBrowser && /(edge)/i.test(navigator.userAgent);

  /**
   * Detects Internet Explorer, which Angular has not supported since v13.
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public TRIDENT: boolean = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public BLINK: boolean =
    this.isBrowser &&
    !!((window as unknown as { chrome?: unknown }).chrome || hasV8BreakIterator) &&
    typeof CSS !== 'undefined' &&
    !this.EDGE &&
    !this.TRIDENT;

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public WEBKIT: boolean =
    this.isBrowser &&
    /AppleWebKit/i.test(navigator.userAgent) &&
    !this.BLINK &&
    !this.EDGE &&
    !this.TRIDENT;

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public IOS: boolean =
    this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public FIREFOX: boolean = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public ANDROID: boolean = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  public SAFARI: boolean = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;

  public getOS(): EOperationSystem | undefined {
    const userAgent = navigator.userAgent.toLowerCase(),
      macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
      windowsPlatforms = /(win32|win64|windows|wince)/i;

    let result: EOperationSystem | undefined;

    if (macosPlatforms.test(userAgent)) {
      result = EOperationSystem.MAC_OS;
    } else if (this.IOS) {
      result = EOperationSystem.IOS;
    } else if (windowsPlatforms.test(userAgent)) {
      result = EOperationSystem.WINDOWS;
    } else if (this.ANDROID) {
      result = EOperationSystem.ANDROID;
    } else if (!result && /linux/.test(userAgent)) {
      result = EOperationSystem.LINUX;
    }

    return result;
  }
}
