import { EMarkdownContainerType, IMarkdownItToken } from './domain';

import type { PluginWithParams } from 'markdown-it';
import container from 'markdown-it-container';
import { isOpeningToken } from './utils';

type ContainerArgs = [ PluginWithParams, string, { render: any } ]

export class ParseShowcase {

  public render(): ContainerArgs {
    return [ container as unknown as PluginWithParams, EMarkdownContainerType.SHOWCASE, {
      render: (tokens: IMarkdownItToken[], index: number) => {
        if (isOpeningToken(tokens[index])) {
          return `<showcase></showcase>`;
        }
        return '';
      },
    } ];
  }
}
