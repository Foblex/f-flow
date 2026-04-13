import { normalizeDomElementId } from '@foblex/utils';

export function createConnectionDomIdentifier(
  componentId: string,
  sourceId: string,
  targetId: string,
): string {
  return normalizeDomElementId('connection_' + componentId + sourceId + targetId);
}
