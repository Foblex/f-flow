import { inject, Injectable } from '@angular/core';
import { defer, from, map, Observable, of, switchMap } from 'rxjs';
import { MarkCodeFocusedBlocksPostProcessor } from './mark-code-focused-blocks.post-processor';
import { UNIVERSAL_THEME } from './theme';
import { catchError, finalize, shareReplay } from 'rxjs/operators';
import { getLanguageLoader, HighlightLanguage, resolveHighlightLanguage } from './languages';
import { IS_BROWSER_PLATFORM, WINDOW } from '../common';
import { createHighlighterCore, HighlighterCore, isSpecialLang } from '@shikijs/core';
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  /**
   * Service for highlighting code blocks using Shiki.
   * It supports syntax highlighting and post-processing for focused blocks.
   */
  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);
  private readonly _window = inject(WINDOW, { optional: true });
  private readonly _languageLoadingTasks = new Map<HighlightLanguage, Observable<void>>();
  private readonly _highlighter$: Observable<HighlighterCore> = defer(() =>
    from(this._createHighlighter()),
  ).pipe(
    shareReplay(1),
  );

  public highlight(
    element: HTMLElement, lang: string, content: string,
  ): Observable<HTMLElement> {
    if (!this._isBrowser) {
      console.warn('[HighlightService] Skipping highlight on server.');
      return of(element);
    }

    const resolvedLanguage = resolveHighlightLanguage(lang);

    return this._ensureLanguageLoaded(resolvedLanguage).pipe(
      switchMap(() => this._highlightCodeBlock(element, resolvedLanguage, content)),
      switchMap((x) => this._postProcess(x)),
      catchError((err) => {
        console.error('[HighlightService] Failed to highlight:', err);
        return of(element);
      }),
    );
  }

  private _highlightCodeBlock(
    element: HTMLElement, lang: string, content: string,
  ): Observable<HTMLElement> {
    return this._highlighter$.pipe(
      switchMap((highlighter) => this._renderCode(element, highlighter, lang, content)),
    );
  }

  private _renderCode(
    element: HTMLElement, highlighter: HighlighterCore, lang: string, content: string,
  ): Observable<HTMLElement> {
    return new Observable<HTMLElement>((observer) => {
      const processedContent = this._preprocessFocus(content);
      element.innerHTML = highlighter.codeToHtml(processedContent, { lang, theme: 'universal', defaultColor: false });
      this._scheduleRender(() => {
        observer.next(element);
        observer.complete();
      });
    });
  }

  private _preprocessFocus(code: string): string {
    return code.replace(/\|:\|([\s\S]*?)\|:\|/g, (_, p1) => `ƒƒƒ${p1}¢¢¢`);
  }

  private _createHighlighter(): Promise<HighlighterCore> {
    return createHighlighterCore({
      engine: createOnigurumaEngine(() => import('shiki/wasm').then((x) => x.default)),
      themes: [ UNIVERSAL_THEME ],
      langs: [],
    });
  }

  private _ensureLanguageLoaded(lang: HighlightLanguage): Observable<void> {
    if (isSpecialLang(lang)) {
      return of(void 0);
    }

    return this._highlighter$.pipe(
      switchMap((highlighter) => {
        if (highlighter.getLoadedLanguages().includes(lang)) {
          return of(void 0);
        }

        const cachedTask = this._languageLoadingTasks.get(lang);
        if (cachedTask) {
          return cachedTask;
        }

        const loader = getLanguageLoader(lang);
        if (!loader) {
          return of(void 0);
        }

        const loadingTask = from(highlighter.loadLanguage(loader)).pipe(
          map(() => void 0),
          catchError((error) => {
            console.error(`[HighlightService] Failed to load language "${lang}"`, error);
            return of(void 0);
          }),
          finalize(() => {
            this._languageLoadingTasks.delete(lang);
          }),
          shareReplay(1),
        );

        this._languageLoadingTasks.set(lang, loadingTask);
        return loadingTask;
      }),
    );
  }

  private _scheduleRender(callback: () => void): void {
    const raf = this._window?.requestAnimationFrame?.bind(this._window);
    if (raf) {
      raf(callback);
      return;
    }
    queueMicrotask(callback);
  }

  private _postProcess(element: HTMLElement): Observable<HTMLElement> {
    const windowRef = this._window;
    if (!windowRef) {
      return of(element);
    }

    return of(element).pipe(
      switchMap((x) => new MarkCodeFocusedBlocksPostProcessor(windowRef).handle(x)),
    );
  }
}
