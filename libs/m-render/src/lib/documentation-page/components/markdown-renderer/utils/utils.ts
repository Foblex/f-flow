import { IMarkdownItToken } from './domain';

export function getContent(tokens: IMarkdownItToken[], index: number, eContainerType: string): string | undefined {
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

export function encodeDataAttr(data: unknown): string {
  return JSON.stringify(data).replace(/"/g, '&quot;');
}

export function isOpeningToken(token: IMarkdownItToken): boolean {
  return token.nesting === 1;
}

export function isClosingToken(token: IMarkdownItToken): boolean {
  return token.nesting === -1;
}

export function parseFileLinkLine(line: string): { fileName: string, url: string } | null {
  const match = line.match(/\[(.+?)\]\s*<<<\s*(.+)/);
  if (!match) return null;

  const fileName = match[1].trim();
  let url = match[2].trim();

  const markdownLink = url.match(/^\[[^\]]+]\((.+)\)$/);
  if (markdownLink) {
    url = markdownLink[1].trim();
  }

  const angleWrapped = url.match(/^<(.+)>$/);
  if (angleWrapped) {
    url = angleWrapped[1].trim();
  }

  return url ? { fileName, url } : null;
}

export function parseSingleBracketText(line: string): string | null {
  const match = line.match(/\[(.+?)\]/);
  return match ? match[1] : null;
}
