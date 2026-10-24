import { normalizeDomElementId } from '../../_libs/f-utils';

export function createConnectionSelectionDomIdentifier(
  componentId: string,
  sourceId: string,
  targetId: string,
): string {
  return normalizeDomElementId('connection_for_selection_' + componentId + sourceId + targetId);
}
