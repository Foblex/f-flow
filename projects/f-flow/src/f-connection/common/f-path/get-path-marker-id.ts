import { normalizeDomElementId } from '@foblex/utils';

export function getMarkerStartId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-marker-start-${ fConnectionId }`);
}

export function getMarkerEndId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-marker-end-${ fConnectionId }`);
}

export function getMarkerSelectedStartId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-selected-marker-start-${ fConnectionId }`);
}

export function getMarkerSelectedEndId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-selected-marker-end-${ fConnectionId }`);
}
