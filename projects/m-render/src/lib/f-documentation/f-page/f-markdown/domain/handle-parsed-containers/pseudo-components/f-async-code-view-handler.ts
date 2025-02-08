import { FCodeViewHandler } from './f-code-view-handler';
import { Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';

export class FAsyncCodeViewHandler extends FCodeViewHandler {

  constructor(
    element: HTMLElement,
    injector: Injector
  ) {
    super(element, injector);
  }

  protected override initialize(): void {
    if (this.isServer()) return;
    const language = this.getFileExtension(this.element.innerHTML);
    this.subscribeOnLoadFile(this.element.innerHTML).pipe(take(1), catchError((err, data) => of(''))).subscribe((content) => {
      this.element.innerHTML = '';
      this.element.appendChild(this.createPreView(language));
      this.getCodeBlock().textContent = content;
      super.initialize();
    });
  }

  private getFileExtension(url: string): string {
    const match = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);

    if (match) {
      let extension = match[1];
      if (extension === 'scss') {
        extension = 'css';
      }
      return extension;
    }
    return '';
  }

  private subscribeOnLoadFile(src: string): Observable<string> {
    return this.injector.get(HttpClient).get(src, { responseType: 'text' });
  }

  private createCodeView(container: HTMLPreElement, language: string): void {
    const code = document.createElement('code');
    code.classList.add(`language-${ language }`);
    container.appendChild(code);
  }

  private createPreView(language: string): HTMLPreElement {
    const pre = document.createElement('pre');
    this.element.appendChild(pre);
    this.createCodeView(pre, language)
    return pre;
  }
}
