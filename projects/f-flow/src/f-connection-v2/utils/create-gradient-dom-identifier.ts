import { normalizeDomElementId } from '@foblex/utils';

export function createGradientDomIdentifier(
  componentId: string,
  sourceId: string,
  targetId: string,
): string {
  return normalizeDomElementId('connection_gradient_' + componentId + sourceId + targetId);
}
