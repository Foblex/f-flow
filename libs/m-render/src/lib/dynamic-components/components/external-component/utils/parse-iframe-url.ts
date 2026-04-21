const URL_PROTOCOL_REGEX = /^(https?:\/\/|\/\/|\/(?!\/)|\.\.?\/)/i;
const BARE_DOMAIN_REGEX = /^(localhost(?::\d+)?|([a-z0-9-]+\.)+[a-z]{2,})(\/.*)?$/i;
const UNSAFE_PROTOCOL_REGEX = /^(javascript|data|vbscript):/i;

export function parseIframeUrl(value: string): string | null {
  if (!value) return null;

  const normalizedValue = value.trim();
  const urlFromAttr = normalizedValue.match(/\[url\]=["']([^"']+)["']/)?.[1]?.trim();
  const candidate = (urlFromAttr || normalizedValue).replace(/^["']|["']$/g, '').trim();

  if (!candidate || candidate.includes('<') || UNSAFE_PROTOCOL_REGEX.test(candidate)) {
    return null;
  }

  if (URL_PROTOCOL_REGEX.test(candidate)) {
    return candidate;
  }

  if (BARE_DOMAIN_REGEX.test(candidate)) {
    return `https://${ candidate }`;
  }

  return null;
}
