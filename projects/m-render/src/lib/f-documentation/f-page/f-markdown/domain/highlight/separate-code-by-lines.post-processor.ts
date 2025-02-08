import { Observable, of } from 'rxjs';
import { IHandler } from '@foblex/mediator';

export class SeparateCodeByLinesPostProcessor implements IHandler<HTMLElement, Observable<HTMLElement>> {

  public handle(element: HTMLElement): Observable<HTMLElement> {
    element.querySelectorAll("pre code").forEach((code) => {
      code.innerHTML = this.getCodeDividedByLines(code);
    });
    return of(element);
  }

  private getCodeDividedByLines(code: Element): string {
    let result = '';
    this.getLines(code).forEach(line => {
      if (!this.isLineEmpty(line)) {
        result += this.getLine(line);
      }
    });
    return result;
  }

  private getLines(code: Element): string[] {
    return code.innerHTML.split('\n');
  }

  private isLineEmpty(line: string): boolean {
    return line.trim() === '';
  }

  private getLine(content: string): string {
    return `<line class="line">${ content }</line>\n`;
  }
}
