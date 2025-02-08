import { EMarkdownContainerType } from './e-markdown-container-type';
import { IMarkdownItToken } from './i-markdown-it-token';
import { INavigationGroup } from '../../../../../f-navigation-panel';
import { getContent } from '../utils';

import container from 'markdown-it-container';

type ContainerArgs = [ typeof container, string, { render: any } ]

export class ParsePreviewGroup {

  constructor(
    private navigation: INavigationGroup[]
  ) {
  }

  public render(): ContainerArgs {
    return [ container, EMarkdownContainerType.PREVIEW_GROUP, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        if (this.isOpeningToken(tokens, index)) {
          return this.getGroupsHTML(this.generateData(tokens, index));
        }
        return '';
      }
    } ];
  }

  private isOpeningToken(tokens: IMarkdownItToken[], index: number): boolean {
    return tokens[ index ].nesting === 1;
  }

  private generateData(tokens: IMarkdownItToken[], index: number): INavigationGroup[] {
    const groups: INavigationGroup[] = [];

    this.parseData(getContent(tokens, index, EMarkdownContainerType.PREVIEW_GROUP) || '').forEach((x: string) => {
      const group = this.navigation.find((g) => g.text === x);
      if (group) {
        groups.push(group)
      }
    });

    return groups;
  }

  private parseData(data: string): string[] {
    return data.split('\n').map(this.extractFileData).filter(Boolean) as string[];
  }

  private extractFileData(line: string): string | null {
    const match = line.match(/\[(.+?)\]/);
    return match ? match[ 1 ] : null;
  }

  private getGroupsHTML(groups: INavigationGroup[]): string {
    const result = (groups || []).map((x) => {
      return `<h2>${ x.text }</h2><div class="f-preview-group">${ this.getItemsHTML(x) }</div>`;
    }).join('');

    return this._getGroupFiltersHTML() + result;
  }

  private _getGroupFiltersHTML(): string {
    return `<f-preview-group-filters></f-preview-group-filters>`;
  }

  private getItemsHTML(group: INavigationGroup): string {
    return group.items.map((item) => {
      return `<f-preview data-group="${ group.text }" data-item="${ item.link }"></f-preview>`
    }).join('');
  }
}
