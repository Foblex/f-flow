import { sanitizeElementId } from '@foblex/core';

export const F_CONNECTION_IDENTIFIERS = {

  textId(connectionId: string): string {
    return sanitizeElementId('connection_text_' + connectionId);
  },
  connectionForSelectionId(connectionId: string): string {
    return sanitizeElementId('connection_for_selection_' + connectionId);
  },
  connectionId(connectionId: string): string {
    return sanitizeElementId('connection_' + connectionId);
  },
  gradientId(connectionId: string): string {
    return sanitizeElementId('connection_gradient_' + connectionId);
  },
  linkToGradient(connectionId: string): string {
    return `url(#${ F_CONNECTION_IDENTIFIERS.gradientId(connectionId) })`;
  },
  linkToConnection(connectionId: string): string {
    return `#${ F_CONNECTION_IDENTIFIERS.connectionId(connectionId) }`;
  }
}
