import { IMarkdownItToken } from './domain';

export function getContent(
  tokens: IMarkdownItToken[],
  index: number,
  eContainerType: string,
): string | undefined {
  let result: string | undefined;

  for (let i = index + 1; i < tokens.length; i++) {
    if (tokens[i].type === `container_${eContainerType}_close`) {
      break;
    }
    if (isInlineToken(tokens[i])) {
      result = tokens[i].content;
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

export function parseFileLinkLine(line: string): { fileName: string; url: string } | null {
  const openBracketIndex = line.indexOf('[');
  if (openBracketIndex === -1) return null;

  const closeBracketIndex = line.indexOf(']', openBracketIndex + 1);
  if (closeBracketIndex === -1) return null;

  const marker = line.slice(closeBracketIndex + 1).trimStart();
  if (!marker.startsWith('<<<')) return null;

  const fileName = line.slice(openBracketIndex + 1, closeBracketIndex).trim();
  let url = marker.slice(3).trim();

  const markdownLinkUrl = parseMarkdownLinkUrl(url);
  if (markdownLinkUrl) {
    url = markdownLinkUrl;
  }

  if (url.startsWith('<') && url.endsWith('>')) {
    url = url.slice(1, -1).trim();
  }

  return url ? { fileName, url } : null;
}

export function parseSingleBracketText(line: string): string | null {
  const openBracketIndex = line.indexOf('[');
  if (openBracketIndex === -1) return null;

  const closeBracketIndex = line.indexOf(']', openBracketIndex + 1);
  if (closeBracketIndex === -1) return null;

  return line.slice(openBracketIndex + 1, closeBracketIndex);
}

function parseMarkdownLinkUrl(value: string): string | null {
  if (!value.startsWith('[')) return null;

  const closeLabelIndex = value.indexOf(']');
  if (closeLabelIndex === -1) return null;
  if (value[closeLabelIndex + 1] !== '(' || !value.endsWith(')')) return null;

  return value.slice(closeLabelIndex + 2, -1).trim();
}
