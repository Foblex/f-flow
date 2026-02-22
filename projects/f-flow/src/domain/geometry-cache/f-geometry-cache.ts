import { Injectable } from '@angular/core';
import { IPoint, IRect, IRoundedRect } from '@foblex/2d';
import { FCacheConnectorKeyFactory } from './f-cache-connector-key-factory';
import { FConnectorEntry, IConnectorGeometryRef } from './f-connector-entry';
import { FNodeEntry } from './f-node-entry';

interface INodeGeometryRef {
  _position: IPoint;
}

@Injectable()
export class FGeometryCache {
  private readonly _nodeEntries = new Map<string, FNodeEntry>();
  private readonly _connectorEntries = new Map<string, FConnectorEntry>();
  private readonly _connectorKeysByNodeId = new Map<string, Set<string>>();
  private readonly _connectorKeysById = new Map<string, Set<string>>();

  private readonly _nodeIdByElement = new WeakMap<Element, string>();
  private readonly _connectorKeyByElement = new WeakMap<Element, string>();

  public registerNode(
    id: string,
    element: HTMLElement | SVGElement,
    nodeRef: INodeGeometryRef,
  ): void {
    const next = new FNodeEntry(id, element, nodeRef);

    this._nodeEntries.set(id, next);
    this._nodeIdByElement.set(element, id);

    this._connectorKeysByNodeId.set(id, this._connectorKeysByNodeId.get(id) ?? new Set());
  }

  public unregisterNode(id: string): void {
    const entry = this._nodeEntries.get(id);
    if (!entry) {
      return;
    }

    this._nodeEntries.delete(id);
    this._nodeIdByElement.delete(entry.element);

    const connectorKeys = Array.from(this._connectorKeysByNodeId.get(id) ?? []);
    connectorKeys.forEach((connectorKey) => {
      const connector = this._connectorEntries.get(connectorKey);
      if (!connector) {
        return;
      }

      this.unregisterConnector(connector.id, connector.kind);
    });
    this._connectorKeysByNodeId.delete(id);
  }

  public registerConnector(
    id: string,
    nodeId: string,
    kind: string,
    elementRef: HTMLElement | SVGElement,
    connectorRef?: IConnectorGeometryRef,
  ): void {
    const key = FCacheConnectorKeyFactory.build(id, kind);

    const previous = this._connectorEntries.get(key);
    if (previous) {
      this._detachConnectorFromNode(previous.key, previous.nodeId);
      this._removeConnectorIdIndex(previous.id, previous.key);
      this._connectorKeyByElement.delete(previous.elementRef);
    }

    const next = new FConnectorEntry(key, id, kind, nodeId, elementRef, connectorRef);

    this._connectorEntries.set(key, next);
    this._connectorKeyByElement.set(elementRef, key);
    this._addConnectorIdIndex(id, key);

    const connectorKeys = this._connectorKeysByNodeId.get(nodeId) ?? new Set<string>();
    connectorKeys.add(key);
    this._connectorKeysByNodeId.set(nodeId, connectorKeys);

    this.invalidateNode(nodeId, 'connector-registered');
  }

  public unregisterConnector(connectorId: string, kind: string): void {
    const cacheKey = FCacheConnectorKeyFactory.build(connectorId, kind);

    const entry = this._connectorEntries.get(cacheKey);
    if (!entry) {
      return;
    }

    this._connectorEntries.delete(cacheKey);
    this._connectorKeyByElement.delete(entry.elementRef);
    this._detachConnectorFromNode(cacheKey, entry.nodeId);
    this._removeConnectorIdIndex(entry.id, cacheKey);

    if (this._nodeEntries.has(entry.nodeId)) {
      this.invalidateNode(entry.nodeId, 'connector-unregistered');
    }
  }

  public getNodeRect(nodeId: string): IRect | undefined {
    return this._nodeEntries.get(nodeId)?.rect ?? undefined;
  }

  public resolveNodeIdByElement(element: HTMLElement | SVGElement): string | undefined {
    return this._nodeIdByElement.get(element);
  }

  public getConnectorRectByElement(element: HTMLElement | SVGElement): IRoundedRect | undefined {
    const cacheKey = this._connectorKeyByElement.get(element);
    if (!cacheKey) {
      return undefined;
    }

    return this._connectorEntries.get(cacheKey)?.rect ?? undefined;
  }

  public invalidateNode(nodeId: string, _reason: string): void {
    const node = this._nodeEntries.get(nodeId);
    if (!node) {
      return;
    }

    node.rect = undefined;

    const connectorKeys = this._connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }

    connectorKeys.forEach((cacheKey) => this._invalidateConnectorInternal(cacheKey, false));
  }

  private _detachConnectorFromNode(connectorKey: string, nodeId: string): void {
    const connectorKeys = this._connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys) {
      return;
    }

    connectorKeys.delete(connectorKey);
    if (!connectorKeys.size) {
      this._connectorKeysByNodeId.delete(nodeId);
    }
  }

  private _invalidateConnectorInternal(connectorKey: string, markNodeAsStale: boolean): void {
    const connector = this._connectorEntries.get(connectorKey);
    if (!connector) {
      return;
    }

    connector.rect = undefined;

    if (markNodeAsStale) {
      const node = this._nodeEntries.get(connector.nodeId);
      if (node) {
        node.rect = undefined;
      }
    }
  }

  private _addConnectorIdIndex(connectorId: string, cacheKey: string): void {
    const connectorKeys = this._connectorKeysById.get(connectorId) ?? new Set<string>();
    connectorKeys.add(cacheKey);
    this._connectorKeysById.set(connectorId, connectorKeys);
  }

  private _removeConnectorIdIndex(connectorId: string, cacheKey: string): void {
    const connectorKeys = this._connectorKeysById.get(connectorId);
    if (!connectorKeys) {
      return;
    }

    connectorKeys.delete(cacheKey);
    if (!connectorKeys.size) {
      this._connectorKeysById.delete(connectorId);
    }
  }

  // private _measureAndStore(
  //   nodeEntries: readonly INodeEntry[],
  //   connectorEntries: readonly IConnectorEntry[],
  // ): void {
  //   if (!nodeEntries.length && !connectorEntries.length) {
  //     return;
  //   }
  //
  //   if (!this._browser.isBrowser() || !this._store.flowHost || !this._store.fCanvas) {
  //     return;
  //   }
  //
  //   const transform = this._store.transform;
  //   const scale = transform.scale || 1;
  //   const transformOffsetX = transform.position.x + transform.scaledPosition.x;
  //   const transformOffsetY = transform.position.y + transform.scaledPosition.y;
  //
  //   const flowHostRect = this._measureBoundingRect(this._store.flowHost);
  //
  //   const nodeRects = new Map<string, DOMRect>();
  //   const connectorRects = new Map<string, DOMRect>();
  //
  //   for (const entry of nodeEntries) {
  //     nodeRects.set(entry.nodeId, this._measureBoundingRect(entry.elementRef));
  //   }
  //
  //   for (const entry of connectorEntries) {
  //     connectorRects.set(entry.cacheKey, this._measureBoundingRect(entry.elementRef));
  //   }
  //
  //   for (const entry of nodeEntries) {
  //     const rect = nodeRects.get(entry.nodeId);
  //     if (!rect) {
  //       continue;
  //     }
  //
  //     entry.cachedRect = this._viewportRectToFlowRect(
  //       rect,
  //       entry.elementRef,
  //       flowHostRect,
  //       scale,
  //       transformOffsetX,
  //       transformOffsetY,
  //     );
  //     entry.revision++;
  //     entry.stale = false;
  //   }
  //
  //   for (const entry of connectorEntries) {
  //     const rect = connectorRects.get(entry.cacheKey);
  //     if (!rect) {
  //       continue;
  //     }
  //
  //     entry.cachedRect = this._viewportRectToFlowRect(
  //       rect,
  //       entry.elementRef,
  //       flowHostRect,
  //       scale,
  //       transformOffsetX,
  //       transformOffsetY,
  //     );
  //     entry.revision++;
  //     entry.stale = false;
  //   }
  // }

  // private _measureBoundingRect(element: HTMLElement | SVGElement): DOMRect {
  //   return element.getBoundingClientRect();
  // }
  //
  // private _viewportRectToFlowRect(
  //   viewportRect: DOMRect,
  //   element: HTMLElement | SVGElement,
  //   flowHostRect: DOMRect,
  //   scale: number,
  //   transformOffsetX: number,
  //   transformOffsetY: number,
  // ): IRoundedRect {
  //   const normalizedX = (viewportRect.left - flowHostRect.left - transformOffsetX) / scale;
  //   const normalizedY = (viewportRect.top - flowHostRect.top - transformOffsetY) / scale;
  //
  //   const unscaledSize = SizeExtensions.initialize(
  //     viewportRect.width / scale,
  //     viewportRect.height / scale,
  //   );
  //
  //   const offsetSize = SizeExtensions.offsetFromElement(element) || unscaledSize;
  //
  //   const unscaledRect = new RoundedRect(
  //     normalizedX,
  //     normalizedY,
  //     unscaledSize.width,
  //     unscaledSize.height,
  //     0,
  //     0,
  //     0,
  //     0,
  //   );
  //
  //   return RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
  // }
}
