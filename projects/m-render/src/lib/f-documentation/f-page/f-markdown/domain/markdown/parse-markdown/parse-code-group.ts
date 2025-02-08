import container from 'markdown-it-container';
import { EMarkdownContainerType } from './e-markdown-container-type';
import { IMarkdownItToken } from './i-markdown-it-token';

type ContainerArgs = [ typeof container, string, { render: any } ]
const F_CONTAINER_CLOSE_TAG = 'container_code-group_close';

export class ParseCodeGroup {

  public render(): ContainerArgs {
    return [ container, EMarkdownContainerType.CODE_GROUP, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        if (this.isOpeningToken(tokens, index)) {
          return this.openingGroupHTML(this.generateTabs(tokens, index));
        }
        return this.closingGroupHTML();
      }
    } ];
  }

  private isOpeningToken(tokens: IMarkdownItToken[], index: number): boolean {
    return tokens[index].nesting === 1;
  }

  private generateTabs(tokens: IMarkdownItToken[], index: number): string {
    let result = '';

    for (let i = index + 1; !this.isClosingToken(tokens, i); i++) {
      if (this.isCodeFenceToken(tokens[i])) {
        const title = this.getCodeBlockTitle(tokens[i].info);
        if (title) {
          result += this.generateTabButton(title);
        }
      }
    }

    return result;
  }

  private isClosingToken(token: IMarkdownItToken[], index: number): boolean {
    return token[index].nesting === -1 && token[index].type === F_CONTAINER_CLOSE_TAG;
  }

  private isCodeFenceToken(token: IMarkdownItToken): boolean {
    return token.type === 'fence' && token.tag === 'code';
  }

  private generateTabButton(title: string): string {
    return `<button class="f-tab-button">${title}</button>`;
  }

  private openingGroupHTML(tabs: string): string {
    return `<div class="f-code-group"><div class="f-code-group-tabs">${tabs}</div><div class="f-code-group-body">\n`;
  }

  private closingGroupHTML(): string {
    return `</div></div>\n`;
  }

  private getCodeBlockTitle(data: string): string {
    return data.match(/\[(.*)\]/)?.[ 1 ] || this.getCodeLanguage(data) || 'txt';
  }

  private getCodeLanguage(data: string): string {
    return data.trim()
      .replace(/=(\d*)/, '')
      .replace(/^ansi$/, '');
  }
}
