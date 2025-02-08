import { Observable, of } from 'rxjs';
import { IHandler } from '@foblex/mediator';

export class ModifyPunctuationHighlightPostProcessor implements IHandler<HTMLElement, Observable<HTMLElement>> {

  public handle(element: HTMLElement): Observable<HTMLElement> {
    element.querySelectorAll('span.token.attr-name').forEach((node) => {
      const text = node.textContent;
      if (text && text.startsWith('[') && text.endsWith(']')) {
        node.innerHTML = this.replacePunctuation(text);
      }
    });
    return of(element);
  }

  private replacePunctuation(text: string): string {
    return text.replace(RULE.regex, RULE.replacer);
  }
}

const RULE = {
  regex: /(\[|\])/g,
  replacer: (match: any) => {
    return `<span class="token punctuation">${ match }</span>`;
  }
};
