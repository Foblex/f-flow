export function extendStyles(
  dest: CSSStyleDeclaration,
  source: Record<string, string>,
  importantProperties?: Set<string>,
) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const value = source[key];

      if (value) {
        dest.setProperty(key, value, importantProperties?.has(key) ? 'important' : '');
      } else {
        dest.removeProperty(key);
      }
    }
  }

  return dest;
}
