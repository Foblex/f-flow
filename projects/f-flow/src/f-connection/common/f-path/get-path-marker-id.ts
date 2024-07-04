import { sanitizeElementId } from '@foblex/core';
import { EFMarkerType } from '../../f-marker/e-f-marker-type';

export function getMarkerStartId(fConnectionId: string): string {
  return sanitizeElementId(`${ EFMarkerType.START }-${ fConnectionId }`);
}

export function getMarkerEndId(fConnectionId: string): string {
  return sanitizeElementId(`${ EFMarkerType.END }-${ fConnectionId }`);
}

export function getMarkerSelectedStartId(fConnectionId: string): string {
  return sanitizeElementId(`${ EFMarkerType.SELECTED_START }-${ fConnectionId }`);
}

export function getMarkerSelectedEndId(fConnectionId: string): string {
  return sanitizeElementId(`${ EFMarkerType.SELECTED_END }-${ fConnectionId }`);
}
