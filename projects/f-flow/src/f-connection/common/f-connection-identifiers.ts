import { normalizeDomElementId } from '@foblex/utils';

export const F_CONNECTION_IDENTIFIERS = {

  textId(connectionId: string): string {
    return normalizeDomElementId('connection_text_' + connectionId);
  },
  connectionForSelectionId(connectionId: string): string {
    return normalizeDomElementId('connection_for_selection_' + connectionId);
  },
  connectionId(connectionId: string): string {
    return normalizeDomElementId('connection_' + connectionId);
  },
  gradientId(connectionId: string): string {
    return normalizeDomElementId('connection_gradient_' + connectionId);
  },
  linkToGradient(connectionId: string): string {
    return `url(#${ F_CONNECTION_IDENTIFIERS.gradientId(connectionId) })`;
  },
  linkToConnection(connectionId: string): string {
    return `#${ F_CONNECTION_IDENTIFIERS.connectionId(connectionId) }`;
  },
}
