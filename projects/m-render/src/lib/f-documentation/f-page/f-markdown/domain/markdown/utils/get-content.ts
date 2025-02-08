import { EMarkdownContainerType, IMarkdownItToken } from '../parse-markdown';

export function getContent(tokens: IMarkdownItToken[], index: number, eContainerType: EMarkdownContainerType): string | undefined {
  let result: string | undefined;

  for (let i = index + 1; i < tokens.length; i++) {
    if (tokens[ i ].type === `container_${ eContainerType }_close`) {
      break;
    }
    if (isInlineToken(tokens[ i ])) {
      result = tokens[ i ].content;
      break;
    }
  }
  return result;
}

function isInlineToken(token: IMarkdownItToken): boolean {
  return token.type === 'inline' && !token.tag;
}
