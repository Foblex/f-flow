import { GetIntersections, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IsConnectionUnderNodeRequest } from './is-connection-under-node.request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeIntersectedWithConnections } from '../../index';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection';
import { GetNormalizedConnectorRectRequest } from '../../../domain';

@Injectable()
@FExecutionRegister(IsConnectionUnderNodeRequest)
export class IsConnectionUnderNodeExecution
  implements IExecution<IsConnectionUnderNodeRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle(request: IsConnectionUnderNodeRequest): void {
    const fOutputConnectors = this._getOutputConnectors(request.fNode);
    const fInputConnectors = this._getInputConnectors(request.fNode);

    if (!fOutputConnectors.length || !fInputConnectors.length) {
      return;
    }

    const fOutputConnections = this._getOutputConnectionsId(fOutputConnectors);
    const fInputConnections = this._getInputConnectionsId(fInputConnectors);

    const fConnectionsUnderNode = this._calculateConnectionsUnderNode(request.fNode).filter((x) => {
      return !fOutputConnections.includes(x.fId()) && !fInputConnections.includes(x.fId());
    });

    if (!fConnectionsUnderNode.length) {
      return;
    }

    this._emitNodeIntersectedWithConnections(request.fNode, fConnectionsUnderNode);
  }

  private _getOutputConnectors(fNode: FNodeBase): FConnectorBase[] {
    return this._store.fOutputs.filter((x) => {
      return fNode.isContains(x.hostElement) && x.canBeConnected;
    });
  }

  private _getInputConnectors(fNode: FNodeBase): FConnectorBase[] {
    return this._store.fInputs.filter((x) => {
      return fNode.isContains(x.hostElement) && x.canBeConnected;
    });
  }

  private _getOutputConnectionsId(connectors: FConnectorBase[]): string[] {
    const connectorsId = this._getConnectorsId(connectors);

    return this._store.fConnections
      .filter((x) => connectorsId.includes(x.fOutputId()))
      .map((x) => x.fId());
  }

  private _getInputConnectionsId(connectors: FConnectorBase[]): string[] {
    const connectorsId = this._getConnectorsId(connectors);

    return this._store.fConnections
      .filter((x) => connectorsId.includes(x.fInputId()))
      .map((x) => x.fId());
  }

  private _getConnectorsId(connectors: FConnectorBase[]): string[] {
    return connectors.map((x) => x.fId());
  }

  private _calculateConnectionsUnderNode(fNode: FNodeBase): FConnectionBase[] {
    const fNodeRect = this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(fNode.hostElement),
    );

    return this._store.fConnections.filter((x) =>
      this._isConnectionHasIntersectionsWithNode(x, fNodeRect),
    );
  }

  private _isConnectionHasIntersectionsWithNode(
    fConnection: FConnectionBase,
    fNodeRect: IRoundedRect,
  ): boolean {
    return (
      GetIntersections.getRoundedRectIntersectionsWithSVGPath(
        fConnection.fPath().hostElement,
        fNodeRect,
      ).length > 0
    );
  }

  private _emitNodeIntersectedWithConnections(
    fNode: FNodeBase,
    fConnections: FConnectionBase[],
  ): void {
    this._store.fDraggable?.fNodeIntersectedWithConnections.emit(
      new FNodeIntersectedWithConnections(
        fNode.fId(),
        fConnections.map((x) => x.fId()),
      ),
    );
  }
}
