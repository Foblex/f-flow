import { normalizeDomElementId } from '../../_libs/f-utils';

export function createConnectionDomIdentifier(
  componentId: string,
  sourceId: string,
  targetId: string,
): string {
  return normalizeDomElementId('connection_' + componentId + sourceId + targetId);
}
