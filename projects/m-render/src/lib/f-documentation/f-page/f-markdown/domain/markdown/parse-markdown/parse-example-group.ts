import { EMarkdownContainerType } from './e-markdown-container-type';
import { IMarkdownItToken } from './i-markdown-it-token';
import { getContent } from '../utils';

import container from 'markdown-it-container';

type ContainerArgs = [ typeof container, string, { render: any } ]

export class ParseExampleGroup {

  public render(): ContainerArgs {
    return [ container, EMarkdownContainerType.EXAMPLE_GROUP, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        if (this.isOpeningToken(tokens, index)) {
          return this.openingExampleGroupHTML(this.generateData(tokens, index));
        }
        return this.closingExampleGroupHTML();
      }
    } ];
  }

  private isNgComponent(token: IMarkdownItToken): boolean {
    return token.info.trim().startsWith(EMarkdownContainerType.EXAMPLE_GROUP);
  }

  private isOpeningToken(tokens: IMarkdownItToken[], index: number): boolean {
    return tokens[ index ].nesting === 1;
  }

  private generateData(tokens: IMarkdownItToken[], index: number): { tabs: string, views: string } {
    let tabs = '';
    let views = '';
    const component = this.parseComponentTags(tokens[ index ]);
    if (component) {
      tabs += this.generateTabButton('Example');
      views += this.generateExampleView(component);
    }
    const content = getContent(tokens, index, EMarkdownContainerType.EXAMPLE_GROUP);
    if (content) {
      this.parseData(content).forEach((x) => {
        tabs += this.generateTabButton(x.fileName);
        views += this.generateAsyncCodeView(x.url);
      });
    } else {
      tabs = '';
    }

    return { tabs, views };
  }

  private parseComponentTags(token: IMarkdownItToken): { tag: string, height?: string } {
    if (!this.isNgComponent(token)) {
      return { tag: '', height: '' };
    }

    let cleanedInput = token.info.replace(/ng-component\s*/, '');

    const tagMatch = cleanedInput.match(/<([a-zA-Z0-9-]+)>.*<\/\1>/);
    const heightMatch = cleanedInput.match(/\[height\]="(\d+)"/);

    if (!tagMatch) {
      throw new Error("Invalid input: no valid tag found");
    }

    const tag = tagMatch[ 0 ];
    const height = heightMatch ? heightMatch[ 1 ] : undefined;

    return { tag, height };
  }

  private parseData(data: string): { fileName: string, url: string }[] {
    return data.split('\n').map(this.extractFileData).filter(Boolean) as { fileName: string, url: string }[];
  }

  private extractFileData(line: string): { fileName: string, url: string } | null {
    const match = line.match(/\[(.+?)\] <<< (.+)/);
    return match ? { fileName: match[ 1 ], url: match[ 2 ] } : null;
  }

  private openingExampleGroupHTML(data: { tabs: string, views: string }): string {
    return `<div class="f-code-group">${ this.groupTabsHTML(data.tabs) }${ this.groupBodyHTML(data.views) }`;
  }

  private groupTabsHTML(content: string): string {
    let result = `<div class="f-code-group-tabs">${ content }</div>`;
    if (!content) {
      result = '';
    }
    return result;
  }

  private generateTabButton(content: string): string {
    return `<button class="f-tab-button">${ content }</button>`;
  }

  private groupBodyHTML(content: string): string {
    return `<div class="f-code-group-body">${ content }`;
  }

  private generateExampleView(content: { tag: string, height?: string }): string {
    let height = '';
    if (content.height) {
      height = `style="height: ${ content.height }px"`;
    }
    return `<div class="f-example-view" ${ height }>${ content.tag }</div>`;
  }

  private generateAsyncCodeView(content: string): string {
    return `<div class="f-async-code-view">${ content }</div>`;
  }

  private closingExampleGroupHTML(): string {
    return `</div></div>\n`;
  }
}
