import { GetIntersections, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IsConnectionUnderNodeRequest } from './is-connection-under-node.request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext, FNodeIntersectedWithConnections, NodeDragHandler } from '../../index';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection';
import { GetNormalizedElementRectRequest } from '../../../domain';

@Injectable()
@FExecutionRegister(IsConnectionUnderNodeRequest)
export class IsConnectionUnderNodeExecution implements IExecution<IsConnectionUnderNodeRequest, void> {

  private _fMediator = inject(FMediator);

  private _fComponentsStore = inject(FComponentsStore);

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: IsConnectionUnderNodeRequest): void {

    const fNode = this._getDraggedNodeUnderPointer();

    const fOutputConnectors = this._getNodeOutputConnectors(fNode);
    const fInputConnectors = this._getNodeInputConnectors(fNode);

    const canBeConnectedOutputs = fOutputConnectors.filter((x) => x.canBeConnected);
    const canBeConnectedInputs = fInputConnectors.filter((x) => x.canBeConnected);

    if (canBeConnectedOutputs.length && canBeConnectedInputs.length) {

      const fOutputConnections = this._getOutputConnectionsId(canBeConnectedOutputs);
      const fInputConnections = this._getInputConnectionsId(canBeConnectedInputs);

      const fConnectionsUnderNode = this._calculateConnectionsUnderNode(fNode).filter((x) => {
        return !fOutputConnections.includes(x.fId) && !fInputConnections.includes(x.fId);
      });

      if(fConnectionsUnderNode.length) {
        this._fComponentsStore.fDraggable?.fNodeIntersectedWithConnections.emit(
          new FNodeIntersectedWithConnections(
            fNode.fId,
            fConnectionsUnderNode.map((x) => x.fId)
          )
        );
      }
    }
  }

  private _getDraggedNodeUnderPointer(): FNodeBase {
    return (this._fDraggableDataContext.draggableItems[ 0 ] as NodeDragHandler).fNode;
  }

  private _getNodeOutputConnectors(fNode: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fOutputs.filter((x) => fNode.isContains(x.hostElement));
  }

  private _getNodeInputConnectors(fNode: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fInputs.filter((x) => fNode.isContains(x.hostElement));
  }

  private _getOutputConnectionsId(connectors: FConnectorBase[]): string[] {
    const connectorsId = this._getConnectorsId(connectors);
    return this._fComponentsStore.fConnections
      .filter((x) => connectorsId.includes(x.fOutputId))
      .map((x) => x.fId);
  }

  private _getInputConnectionsId(connectors: FConnectorBase[]): string[] {
    const connectorsId = this._getConnectorsId(connectors);
    return this._fComponentsStore.fConnections
      .filter((x) => connectorsId.includes(x.fInputId))
      .map((x) => x.fId);
  }

  private _getConnectorsId(connectors: FConnectorBase[]): string[] {
    return connectors.map((x) => x.fId);
  }

  private _calculateConnectionsUnderNode(fNode: FNodeBase): FConnectionBase[] {
    const fNodeRect = this._fMediator.send<IRoundedRect>(new GetNormalizedElementRectRequest(fNode.hostElement, true));
    return this._fComponentsStore.fConnections.filter((x) => {
      return this._isConnectionHasIntersectionsWithNode(x, fNodeRect);
    });
  }

  private _isConnectionHasIntersectionsWithNode(fConnection: FConnectionBase, fNodeRect: IRoundedRect): boolean {
    return GetIntersections.getRoundedRectIntersectionsWithSVGPath(fConnection.fPath.hostElement, fNodeRect).length > 0;
  }
}
