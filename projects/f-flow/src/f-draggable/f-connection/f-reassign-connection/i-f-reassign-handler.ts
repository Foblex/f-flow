import { IPoint, RectExtensions, RoundedRect } from "@foblex/2d";
import { IClosestConnector, IConnectorAndRect } from "../../../domain";
import { FSnapConnectionComponent } from "../../../f-connection";

export interface IFReassignHandler {

  getConnectableConnectors(): IConnectorAndRect[];

  markConnectableConnector(): void;

  initializeSnapConnection(snapConnection: FSnapConnectionComponent | undefined): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp(): void;
}

export function isClosestConnectorInsideSnapThreshold(fClosestConnector: IClosestConnector | undefined, snapConnection: FSnapConnectionComponent): IClosestConnector | undefined {
  return fClosestConnector && fClosestConnector.distance < snapConnection.fSnapThreshold ? fClosestConnector : undefined;
}

export function roundedRectFromPoint(point: IPoint) {
  return RoundedRect.fromRect(RectExtensions.initialize(point.x, point.y))
}
