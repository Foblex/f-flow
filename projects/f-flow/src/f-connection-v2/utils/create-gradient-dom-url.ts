import { createGradientDomIdentifier } from './create-gradient-dom-identifier';

export function createGradientDomUrl(
  componentId: string,
  sourceId: string,
  targetId: string,
): string {
  return `url(#${createGradientDomIdentifier(componentId, sourceId, targetId)})`;
}
