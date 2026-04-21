import MarkdownIt from 'markdown-it';
import { IMarkdownItToken } from './domain';
import { EParsedContainerType, IParsedContainerData } from './domain';
import { encodeDataAttr } from './utils';

export class ParseSingleCodeItem {

  public render(markdown: MarkdownIt): void {
    const fence = markdown.renderer.rules.fence;
    if (!fence) {
      throw new Error('Markdown renderer does not have a fence rule.');
    }

    markdown.renderer.rules.fence = (tokens: IMarkdownItToken[], index: number) => {
      const data = this._getTokenData(tokens[index]);
      return (
        `<f-code-group data-data="${encodeDataAttr([this._createCodeData(data)])}"></f-code-group>`
      );
    };
  }

  private _getTokenData(token: IMarkdownItToken): ITokenData {
    return { value: token.content, language: token.info };
  }

  private _createCodeData({ value, language }: ITokenData): IParsedContainerData {
    return {
      tab: '',
      value,
      language,
      type: EParsedContainerType.CODE,
    };
  }
}

interface ITokenData {
  value: string;
  language: string;
}
