import MarkdownIt from 'markdown-it';
import { IMarkdownItToken } from './i-markdown-it-token';

export class ParseCodeView {

  public render(markdown: MarkdownIt): void {
    const fence = markdown.renderer.rules.fence as unknown as Function;
    if (!fence) {
      throw new Error('Markdown renderer does not have a fence rule.');
    }

    markdown.renderer.rules.fence = (tokens: IMarkdownItToken[], index: number, ...rest) => {
      return (
        `<div class="f-code-view">${ fence(tokens, index, ...rest) }</div>`
      );
    }
  }

  private cleanTokenInfo(info: string): string {
    return info.replace(/\[.*\]/, '');
  }
}
