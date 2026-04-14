import { RoundedRect } from '@foblex/2d';
import { IConnectorRectRef } from '../../../domain';
import { FConnectionBase } from '../../../f-connection-v2';

export interface IReassignConnectionDragResult {
  /** Which handle is being dragged: source(output) or target(input). */
  draggedEnd: 'source' | 'target';

  /**
   * Line endpoints represented as small rects (anchors) so we can use the same math as for connectors.
   * These are NOT connector bounds.
   */
  sourceAnchorRect: RoundedRect;
  targetAnchorRect: RoundedRect;

  /** Connection being reassigned. */
  connection: FConnectionBase;

  /** Candidate connectors that are connectable for this reassignment. */
  candidates: IConnectorRectRef[];
}
