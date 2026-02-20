import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IRect, IRoundedRect } from '@foblex/2d';
import { EnsureNodeGeometryFreshRequest } from './ensure-node-geometry-fresh-request';
import { FGeometryCache } from '../f-geometry-cache';
import { FComponentsStore } from '../../../f-storage';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';

/**
 * Ensures the geometry cache entries for a node and all its connectors are up-to-date.
 *
 * Rules:
 * - If both node and all its connectors are fresh (not stale) → zero DOM reads.
 * - If any entry is stale AND the DOM element is available → batch-refresh node + connectors.
 * - If the DOM element is absent (virtualised / offscreen) → leave stale; model geometry is used.
 */
@Injectable()
@FExecutionRegister(EnsureNodeGeometryFreshRequest)
export class EnsureNodeGeometryFreshExecution
  implements IExecution<EnsureNodeGeometryFreshRequest, void>
{
  private readonly _cache = inject(FGeometryCache);
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({ nodeId }: EnsureNodeGeometryFreshRequest): void {
    if (!this._cache.isNodeStale(nodeId)) {
      return; // Already fresh — zero DOM reads.
    }

    if (!this._cache.hasNodeDom(nodeId)) {
      return; // No DOM available (virtualised/LOD0/1) — skip DOM reads.
    }

    this._refreshFromDom(nodeId);
  }

  private _refreshFromDom(nodeId: string): void {
    const nodeInstance = this._store.nodes.get(nodeId);
    if (!nodeInstance) {
      return;
    }

    // Measure node rect from DOM (world/canvas space).
    const nodeWorldRect = this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(nodeInstance.hostElement),
    );
    this._cache.setNodeRect(nodeId, nodeWorldRect);

    // Batch-measure all connector rects for this node.
    for (const connectorId of this._cache.getConnectorsByNode(nodeId)) {
      this._refreshConnector(connectorId);
    }
  }

  private _refreshConnector(connectorId: string): void {
    // Try outputs, then inputs, then outlets.
    const connector =
      this._store.outputs.get(connectorId) ??
      this._store.inputs.get(connectorId) ??
      this._store.outlets.get(connectorId);

    if (!connector) {
      return;
    }

    const rect = this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(connector.hostElement),
    );
    this._cache.setConnectorRect(connectorId, rect);
  }
}
