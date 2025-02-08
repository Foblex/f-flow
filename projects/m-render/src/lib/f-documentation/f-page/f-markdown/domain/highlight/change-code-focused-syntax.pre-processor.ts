import { Observable, of } from 'rxjs';
import { IHandler } from '@foblex/mediator';

//To prevent replacing the focus syntax (Prism) in the code blocks, we need to change from the default syntax to a custom one.
export class ChangeCodeFocusedSyntaxPreProcessor implements IHandler<HTMLElement, Observable<HTMLElement>> {

  public handle(element: HTMLElement): Observable<HTMLElement> {
    this.getCodeBlocks(element).forEach((block) => {
      block.innerHTML = this.replaceFocus(block.innerHTML);
    });

    return of(element);
  }

  private getCodeBlocks(element: HTMLElement): HTMLElement[] {
    return Array.from(element.querySelectorAll('pre code'));
  }

  private replaceFocus(text: string): string {
    return text.replace(RULE.regex, RULE.replacer);
  }
}

const RULE = {
  regex: /\|:\|(.*?)\|:\|/g,
  replacer: (match: any, p1: any) => {
    return `|foc-|${ p1 }|-foc|`;
  }
};
