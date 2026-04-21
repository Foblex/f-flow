export function parseComponentTag(html: string): string | null {
  const regex = /^<([a-zA-Z][a-zA-Z0-9-]*)(\s+[^>]+)?>\s*<\/\1>$/s;
  const match = regex.exec(html.trim());
  return match ? match[1] : null;
}
