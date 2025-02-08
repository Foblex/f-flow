import { Injectable } from '@angular/core';
import { Observable, of, Subscriber, switchMap } from 'rxjs';
import { ChangeCodeFocusedSyntaxPreProcessor } from './change-code-focused-syntax.pre-processor';
import { SeparateCodeByLinesPostProcessor } from './separate-code-by-lines.post-processor';
import { ModifyPunctuationHighlightPostProcessor } from './modify-punctuation-highlight.post-processor';
import { MarkCodeFocusedBlocksPostProcessor } from './mark-code-focused-blocks.post-processor';
import { BrowserService } from '@foblex/platform';

@Injectable()
export class HighlightService {

  private Prism: any;

  constructor(
    private fBrowser: BrowserService
  ) {
  }

  public highlight(element: HTMLElement): Observable<any> {
    return this.fBrowser.isBrowser() ? this.markNoneLanguage(element).pipe(
      switchMap((x) => new ChangeCodeFocusedSyntaxPreProcessor().handle(x)),
      switchMap((x) => this.highlightCodeWithPrism(x)),
      switchMap((x) => new ModifyPunctuationHighlightPostProcessor().handle(x)),
      switchMap((x) => new SeparateCodeByLinesPostProcessor().handle(x)),
      switchMap((x) => new MarkCodeFocusedBlocksPostProcessor(this.fBrowser).handle(x))
     ) : of(element);
  }

  private highlightCodeWithPrism(element: HTMLElement): Observable<HTMLElement> {
    return new Observable<HTMLElement>((observer) => {
      setTimeout(() => {
        this.loadPrism().then((x) => {
          this.highlightAllUnder(x, observer, element);
        });
      });
    });
  }

  private highlightAllUnder(prism: any | undefined, observer: Subscriber<HTMLElement>, element: HTMLElement): void {
    try {
      prism?.highlightAllUnder(element);
    } catch (e) {
    }
    observer.next(element);
    observer.complete();
  }

  private async loadPrism(): Promise<any> {
    if(!this.Prism) {
      this.Prism = await import('prismjs');
      await Promise.all([
        // @ts-ignore
        import('prismjs/components/prism-bash'), import('prismjs/components/prism-css'), import('prismjs/components/prism-typescript')
      ]);
    }
    return this.Prism;
  }

  private markNoneLanguage(element: HTMLElement): Observable<HTMLElement> {
    element.querySelectorAll('pre code:not([class*="language-"])').forEach(
      (x) => x.classList.add('language-none')
    );
    return of(element);
  }
}
