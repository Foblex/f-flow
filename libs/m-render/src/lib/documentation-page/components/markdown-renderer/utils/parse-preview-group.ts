import { EMarkdownContainerType, IMarkdownItToken, IPreviewNavigationGroup } from './domain';

import type { PluginWithParams } from 'markdown-it';
import container from 'markdown-it-container';
import { getContent, isOpeningToken, parseSingleBracketText } from './utils';

type ContainerArgs = [ PluginWithParams, string, { render: any } ]

export class ParsePreviewGroup {

  constructor(
    private _navigation: IPreviewNavigationGroup[],
  ) {
  }

  public render(): ContainerArgs {
    return [ container as unknown as PluginWithParams, EMarkdownContainerType.PREVIEW_GROUP, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        if (isOpeningToken(tokens[index])) {
          return this._getGroupsHTML(this._generateData(tokens, index));
        }
        return '';
      },
    } ];
  }

  private _generateData(tokens: IMarkdownItToken[], index: number): IPreviewNavigationGroup[] {
    const groups: IPreviewNavigationGroup[] = [];

    this._parseData(getContent(tokens, index, EMarkdownContainerType.PREVIEW_GROUP) || '').forEach((x: string) => {
      const group = this._navigation.find((g) => g.text === x || g.id === x);
      if (group) {
        groups.push(group)
      }
    });

    return groups;
  }

  private _parseData(data: string): string[] {
    return data.split('\n').map(parseSingleBracketText).filter(Boolean) as string[];
  }

  private _getGroupsHTML(groups: IPreviewNavigationGroup[]): string {
    const result = (groups || []).map((x) => {
      return `<h2>${ x.text }</h2><div class="f-preview-group">${ this._getItemsHTML(x) }</div>`;
    }).join('');

    return this._getGroupFiltersHTML() + result;
  }

  private _getGroupFiltersHTML(): string {
    return `<f-preview-group-filters></f-preview-group-filters>`;
  }

  private _getItemsHTML(group: IPreviewNavigationGroup): string {
    return group.items.map((item) => {
      return `<f-preview data-group="${ group.text }" data-item="${ item.link }"></f-preview>`
    }).join('');
  }
}
