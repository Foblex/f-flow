import { GetIntersections, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { DetectConnectionsUnderDragNodeRequest } from './detect-connections-under-drag-node-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeConnectionsIntersectionEvent } from '../../index';
import { FNodeBase } from '../../../f-node';
import { GetNormalizedConnectorRectRequest } from '../../../domain';
import { FConnectionBase } from '../../../f-connection-v2';

@Injectable()
@FExecutionRegister(DetectConnectionsUnderDragNodeRequest)
export class DetectConnectionsUnderDragNode
  implements IExecution<DetectConnectionsUnderDragNodeRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle({ nodeOrGroup }: DetectConnectionsUnderDragNodeRequest): void {
    const sourceConnectorIds = this._collectConnectableConnectorIds(nodeOrGroup, 'source');
    const targetConnectorIds = this._collectConnectableConnectorIds(nodeOrGroup, 'target');

    if (!sourceConnectorIds.size || !targetConnectorIds.size) {
      return;
    }

    const attachedConnectionIds = this._collectAttachedConnectionIds(
      sourceConnectorIds,
      targetConnectorIds,
    );

    const underNode = this._collectConnectionsUnderNode(nodeOrGroup);

    const intersectedIds: string[] = [];
    for (const c of underNode) {
      const id = c.fId();
      if (!attachedConnectionIds.has(id)) {
        intersectedIds.push(id);
      }
    }

    if (!intersectedIds.length) {
      return;
    }

    this._store.fDraggable?.fNodeIntersectedWithConnections.emit(
      new FNodeConnectionsIntersectionEvent(nodeOrGroup.fId(), intersectedIds),
    );
    this._store.fDraggable?.fNodeConnectionsIntersection.emit(
      new FNodeConnectionsIntersectionEvent(nodeOrGroup.fId(), intersectedIds),
    );
  }

  private _collectConnectableConnectorIds(node: FNodeBase, kind: 'target' | 'source'): Set<string> {
    const list = kind === 'source' ? this._store.outputs.getAll() : this._store.inputs.getAll();

    const ids = new Set<string>();
    for (const c of list) {
      if (c.canBeConnected && node.isContains(c.hostElement)) {
        ids.add(c.fId());
      }
    }

    return ids;
  }

  private _collectAttachedConnectionIds(
    outputConnectorIds: Set<string>,
    inputConnectorIds: Set<string>,
  ): Set<string> {
    const ids = new Set<string>();

    for (const connection of this._store.connections.getAll()) {
      if (
        outputConnectorIds.has(connection.fOutputId()) ||
        inputConnectorIds.has(connection.fInputId())
      ) {
        ids.add(connection.fId());
      }
    }

    return ids;
  }

  private _collectConnectionsUnderNode(node: FNodeBase): FConnectionBase[] {
    const nodeRect = this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(node.hostElement),
    );

    const result: FConnectionBase[] = [];
    for (const c of this._store.connections.getAll()) {
      if (this._hasIntersection(c, nodeRect)) {
        result.push(c);
      }
    }

    return result;
  }

  private _hasIntersection(connection: FConnectionBase, nodeRect: IRoundedRect): boolean {
    return (
      GetIntersections.getRoundedRectIntersectionsWithSVGPath(
        connection.fPath().hostElement,
        nodeRect,
      ).length > 0
    );
  }
}
