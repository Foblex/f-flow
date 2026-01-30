import { IPoint, RectExtensions, RoundedRect } from '@foblex/2d';
import { IClosestConnectorRef, IConnectorRectRef } from '../../../domain';
import { FSnapConnectionComponent } from '../../../f-connection';

export interface IFReassignHandler {
  getConnectableConnectors(): IConnectorRectRef[];

  markConnectableConnector(): void;

  initializeSnapConnection(snapConnection: FSnapConnectionComponent | undefined): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp(): void;
}

export function isClosestConnectorInsideSnapThreshold(
  fClosestConnector: IClosestConnectorRef | undefined,
  snapConnection: FSnapConnectionComponent,
): IClosestConnectorRef | undefined {
  return fClosestConnector && fClosestConnector.distance < snapConnection.fSnapThreshold
    ? fClosestConnector
    : undefined;
}

export function roundedRectFromPoint(point: IPoint) {
  return RoundedRect.fromRect(RectExtensions.initialize(point.x, point.y));
}
