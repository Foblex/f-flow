import { IPoint, RectExtensions, RoundedRect } from '@foblex/2d';
import { FSnapConnectionComponent } from '../../../../f-connection';
import { IClosestConnectorRef, IConnectorRectRef } from '../../../../domain';

export interface IReassignHandler {
  /** List used by finalize step to find the closest candidate connector. */
  candidates(): IConnectorRectRef[];

  /** Collects candidates and marks them in UI. */
  collectAndMarkCandidates(): void;

  /** Optional snap connection preview. */
  setSnapConnection(snap: FSnapConnectionComponent | undefined): void;

  onPointerMove(difference: IPoint): void;
  onPointerUp(): void;
}

export function withinSnapThreshold(
  fClosestConnector: IClosestConnectorRef | undefined,
  snapConnection: FSnapConnectionComponent,
): IClosestConnectorRef | undefined {
  return fClosestConnector && fClosestConnector.distance < snapConnection.fSnapThreshold
    ? fClosestConnector
    : undefined;
}

export function rectFromPoint(point: IPoint) {
  return RoundedRect.fromRect(RectExtensions.initialize(point.x, point.y));
}
