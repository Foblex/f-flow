export function getMarkerStartId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-marker-start-${ fConnectionId }`);
}

export function getMarkerEndId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-marker-end-${ fConnectionId }`);
}

export function getMarkerSelectedStartId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-selected-marker-start-${ fConnectionId }`);
}

export function getMarkerSelectedEndId(fConnectionId: string): string {
  return sanitizeElementId(`f-connection-selected-marker-end-${ fConnectionId }`);
}

function sanitizeElementId(id: string): string {
  if (!id.match(/^[a-zA-Z_]/)) {
    id = '_' + id;
  }
  return id.replace(/[^a-zA-Z0-9_\-:.]/g, '_');
}
