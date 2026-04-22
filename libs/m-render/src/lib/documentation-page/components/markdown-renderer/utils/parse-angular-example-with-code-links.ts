import { EMarkdownContainerType } from './domain';
import { IMarkdownItToken } from './domain';

import type { PluginWithParams } from 'markdown-it';
import container from 'markdown-it-container';
import { EParsedContainerType, IMarkdownContainerData, IParsedContainerData } from './domain';
import { encodeDataAttr, getContent, isOpeningToken, parseFileLinkLine } from './utils';

type ContainerArgs = [PluginWithParams, string, { render: any }];

export class ParseAngularExampleWithCodeLinks {

  public render(): ContainerArgs {
    return [container as unknown as PluginWithParams, EMarkdownContainerType.EXAMPLE_GROUP, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        return isOpeningToken(tokens[index]) ? this._opening(tokens, index) : '</f-code-group>';
      },
    }];
  }

  private _opening(tokens: IMarkdownItToken[], index: number): string {
    const data = this._collectData(tokens, index);
    return `<f-code-group data-data="${encodeDataAttr(data)}">`;
  }

  private _collectData(tokens: IMarkdownItToken[], index: number): IParsedContainerData[] {
    const result: IParsedContainerData[] = [];

    const source = this._parseNgComponent(tokens[index]);
    const height = source?.height || 'auto';
    if (source) {
      result.push({
        tab: 'Example',
        value: source.value,
        type: EParsedContainerType.EXAMPLE,
        height,
      });
    }

    const content = getContent(tokens, index, EMarkdownContainerType.EXAMPLE_GROUP);
    const items = (content || '').split('\n').map(parseFileLinkLine).filter(Boolean) as {
      fileName: string,
      url: string
    }[];
    items.forEach(({ fileName, url }) => result.push({
      tab: fileName,
      value: url,
      isLink: true,
      type: EParsedContainerType.CODE,
      height,
    }));

    return result;
  }

  private _parseNgComponent(token: IMarkdownItToken): IMarkdownContainerData | null {
    const cleanedInput = token.info.replace(/^ng-component\s*/, '').trim();
    const height = this._parseHeight(cleanedInput);

    const componentTag = cleanedInput.match(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?>\s*<\/\1>/s)?.[0]?.trim();
    if (componentTag) {
      return {
        value: componentTag,
        height,
      };
    }

    const explicitUrl = cleanedInput.match(/\[url\]=["']([^"']+)["']/)?.[1]?.trim();
    if (explicitUrl) {
      return {
        value: explicitUrl,
        height,
      };
    }

    const implicitUrl = cleanedInput
      .replace(/\[height\]=["'][^"']*["']/g, '')
      .trim()
      .replace(/^["']|["']$/g, '');

    if (!implicitUrl || implicitUrl.includes('<')) return null;

    return {
      value: implicitUrl,
      height,
    };
  }

  private _parseHeight(input: string): string | number | undefined {
    const rawHeight = input.match(/\[height\]=["']([^"']+)["']/)?.[1]?.trim();
    if (!rawHeight) return undefined;

    const numericHeight = Number(rawHeight);
    return Number.isFinite(numericHeight) ? numericHeight : rawHeight;
  }
}
