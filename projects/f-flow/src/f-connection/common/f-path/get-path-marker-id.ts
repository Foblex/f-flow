import { sanitizeElementId } from '@foblex/core';
//import { EFMarkerType } from '../../f-marker';

export function getMarkerStartId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-marker-start-${ fConnectionId }`);
}

export function getMarkerEndId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-marker-end-${ fConnectionId }`);
}

export function getMarkerSelectedStartId(fConnectionId: string): string {
  return sanitizeElementId(`'f-connection-selected-marker-start-${ fConnectionId }`);
}

export function getMarkerSelectedEndId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-selected-marker-end-${ fConnectionId }`);
}
