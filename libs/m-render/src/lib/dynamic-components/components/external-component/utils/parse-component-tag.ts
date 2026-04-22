export function parseComponentTag(html: string): string | null {
  const value = html.trim();
  if (!value.startsWith('<') || !value.endsWith('>')) return null;

  const openingTagEndIndex = value.indexOf('>');
  if (openingTagEndIndex === -1) return null;

  const openingTagContent = value.slice(1, openingTagEndIndex).trim();
  const tagName = getTagName(openingTagContent);
  if (!isValidComponentTagName(tagName)) return null;

  const closingTag = `</${tagName}>`;
  const content = value.slice(openingTagEndIndex + 1, -closingTag.length).trim();

  return content === '' && value.endsWith(closingTag) ? tagName : null;
}

function getTagName(value: string): string {
  for (let i = 0; i < value.length; i++) {
    if (isWhitespace(value.charCodeAt(i))) {
      return value.slice(0, i);
    }
  }

  return value;
}

function isValidComponentTagName(value: string): boolean {
  if (!value) return false;

  const firstChar = value.charCodeAt(0);
  if (!isAsciiLetter(firstChar)) return false;

  for (let i = 1; i < value.length; i++) {
    const char = value.charCodeAt(i);
    if (!isAsciiLetter(char) && !isAsciiDigit(char) && value[i] !== '-') {
      return false;
    }
  }

  return true;
}

function isAsciiLetter(char: number): boolean {
  return (char >= 65 && char <= 90) || (char >= 97 && char <= 122);
}

function isAsciiDigit(char: number): boolean {
  return char >= 48 && char <= 57;
}

function isWhitespace(char: number): boolean {
  return char === 9 || char === 10 || char === 12 || char === 13 || char === 32;
}
