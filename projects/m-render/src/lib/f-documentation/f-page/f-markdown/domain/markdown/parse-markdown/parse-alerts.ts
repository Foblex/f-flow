import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { IMarkdownItToken } from './i-markdown-it-token';

type ContainerArgs = [ typeof container, string, { render: any } ]

export class ParseAlerts {

  public render(type: string, markdown: MarkdownIt): ContainerArgs {
    return [ container, type, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        const token = tokens[ index ];
        const info = token.info.trim().slice(type.length).trim();
        if (token.nesting === 1) {
          const title = markdown.renderInline(info);
          return `<div class="f-alert ${ type }"><p class="f-alert-title">${ title }</p>\n`;
        } else {
          return `</div>\n`;
        }
      }
    } ];
  }
}
