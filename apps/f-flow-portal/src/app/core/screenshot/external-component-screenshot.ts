import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExternalComponentScreenshot {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _document = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);

  private _initialized = false;
  private _capturing = false;

  public initialize(): void {
    if (this._initialized || !isPlatformBrowser(this._platformId)) {
      return;
    }
    this._initialized = true;

    this._document.addEventListener('keydown', this._onKeyDown, true);
    this._destroyRef.onDestroy(() => {
      this._document.removeEventListener('keydown', this._onKeyDown, true);
    });
  }

  private readonly _onKeyDown = (event: KeyboardEvent): void => {
    if (!this._isHotkey(event)) {
      return;
    }

    const target = this._document.querySelector<HTMLElement>('external-component');
    if (!target) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    void this._capture(target);
  };

  // Ctrl/Cmd + Alt + S. Use event.code — on macOS, Option+letter rewrites event.key
  // (e.g. Option+S -> "ß"), so matching on event.key would silently miss real presses.
  private _isHotkey(event: KeyboardEvent): boolean {
    return (event.ctrlKey || event.metaKey) && event.altKey && event.code === 'KeyS';
  }

  private async _capture(element: HTMLElement): Promise<void> {
    if (this._capturing) {
      return;
    }
    this._capturing = true;

    const view = this._document.defaultView;
    if (!view) {
      this._capturing = false;

      return;
    }

    try {
      await this._waitForFonts();

      const scale = view.devicePixelRatio || 2;

      // Capture external-component directly — no ancestor/container mutation.
      // Mutating an outer scroll container's size can trigger cascading
      // ResizeObserver callbacks in the flow widgets and feedback-loop into
      // a reflow hang. Isolating the subtree keeps capture cheap and safe.
      //
      // The caveat: when modern-screenshot clones the subtree it loses any
      // CSS custom properties inherited from :root (the flow widgets use
      // many --ff-example-control-* vars). Inline those vars on the element
      // so the clone resolves them correctly.
      const restoreVars = this._inlineRootCustomProperties(element, view);

      const { domToBlob } = await import('modern-screenshot');

      let blob: Blob | null;
      try {
        blob = await domToBlob(element, {
          scale,
          width: element.offsetWidth,
          height: element.offsetHeight,
          backgroundColor: this._resolveBackgroundColor(element),
        });
      } finally {
        restoreVars();
      }

      if (blob) {
        this._download(blob);
      }
    } catch (error) {
      console.error('[ExternalComponentScreenshot] capture failed', error);
    } finally {
      this._capturing = false;
    }
  }

  private _inlineRootCustomProperties(element: HTMLElement, view: Window): () => void {
    const computed = view.getComputedStyle(this._document.documentElement);
    const applied: string[] = [];
    for (let i = 0; i < computed.length; i++) {
      const name = computed[i];
      if (name.startsWith('--')) {
        const value = computed.getPropertyValue(name);
        if (value && !element.style.getPropertyValue(name)) {
          element.style.setProperty(name, value);
          applied.push(name);
        }
      }
    }

    return () => {
      for (const name of applied) {
        element.style.removeProperty(name);
      }
    };
  }

  private async _waitForFonts(): Promise<void> {
    const fonts = this._document.fonts;
    if (fonts && typeof fonts.ready?.then === 'function') {
      try {
        await fonts.ready;
      } catch {
        // ignore — proceed with whatever is available
      }
    }
  }

  private _resolveBackgroundColor(element: HTMLElement): string | undefined {
    const view = this._document.defaultView;
    if (!view) {
      return undefined;
    }
    const color = view.getComputedStyle(element).backgroundColor;
    if (!color || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      return view.getComputedStyle(this._document.body).backgroundColor || undefined;
    }

    return color;
  }

  private _download(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const anchor = this._document.createElement('a');
    anchor.href = url;
    anchor.download = `${this._resolveSlug()}.${this._resolveThemeSuffix()}.png`;
    this._document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  private _resolveSlug(): string {
    const view = this._document.defaultView;
    const pathname = view?.location?.pathname ?? '';
    const segment = pathname.split('/').filter(Boolean).pop();

    return segment || 'external-component';
  }

  private _resolveThemeSuffix(): 'dark' | 'light' {
    return this._document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
}
