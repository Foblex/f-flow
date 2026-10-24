import { normalizeDomElementId } from '../../_libs/f-utils';

export function createGradientDomIdentifier(componentId: string): string {
  return normalizeDomElementId('connection_gradient_' + componentId);
}
