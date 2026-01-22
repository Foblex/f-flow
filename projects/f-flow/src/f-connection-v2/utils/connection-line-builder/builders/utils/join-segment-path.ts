export function joinSegmentPaths(segments: string[]): string {
  if (!segments.length) return '';
  let d = segments[0];

  for (let i = 1; i < segments.length; i++) {
    d += ' ' + segments[i];
  }

  return d;
}
