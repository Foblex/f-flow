import MarkdownIt, { PluginWithParams } from 'markdown-it';
import container from 'markdown-it-container';
import { IMarkdownItToken } from './domain';
import { isOpeningToken } from './utils';

type ContainerArgs = [ PluginWithParams, string, { render: any } ]

export class ParseAlerts {

  public render(type: string, markdown: MarkdownIt): ContainerArgs {
    return [ container as unknown as PluginWithParams, type, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        const token = tokens[ index ];
        const info = token.info.trim().slice(type.length).trim();
        if (isOpeningToken(token)) {
          const title = markdown.renderInline(info);
          return `<div class="f-alert ${ type }"><p class="f-alert-title">${ title }</p>\n`;
        } else {
          return `</div>\n`;
        }
      },
    } ];
  }
}
