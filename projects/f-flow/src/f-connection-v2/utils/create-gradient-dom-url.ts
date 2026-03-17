import { createGradientDomIdentifier } from './create-gradient-dom-identifier';

export function createGradientDomUrl(componentId: string): string {
  return `url(#${createGradientDomIdentifier(componentId)})`;
}
