import { Injectable } from '@angular/core';
import { IRect, IRoundedRect, RectExtensions, RoundedRect } from '@foblex/2d';
import { FCacheConnectorKeyFactory } from './f-cache-connector-key-factory';
import { FConnectorEntry, IConnectorGeometryRef } from './f-connector-entry';
import { FNodeEntry } from './node-cache/f-node-entry';
import { INodeGeometryRef } from './node-cache/i-node-geometry-ref';

@Injectable()
export class FGeometryCache {
  private readonly _nodeEntries = new Map<string, FNodeEntry>();
  private readonly _nodeIdByElement = new WeakMap<Element, string>();

  private readonly _connectorEntries = new Map<string, FConnectorEntry>();
  private readonly _connectorKeysByNodeId = new Map<string, Set<string>>();

  private readonly _connectorKeyByElement = new WeakMap<Element, string>();

  public registerNode(
    id: string,
    element: HTMLElement | SVGElement,
    reference: INodeGeometryRef,
  ): void {
    const next = new FNodeEntry(id, element, reference);

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
    element: HTMLElement | SVGElement,
    connectorRef?: IConnectorGeometryRef,
  ): void {
    const key = FCacheConnectorKeyFactory.build(id, kind);

    const previous = this._connectorEntries.get(key);
    if (previous) {
      this._detachConnectorFromNode(previous.key, previous.nodeId);
      this._connectorKeyByElement.delete(previous.element);
    }

    const next = new FConnectorEntry(key, id, kind, nodeId, element, connectorRef);

    this._connectorEntries.set(key, next);
    this._connectorKeyByElement.set(element, key);

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
    this._connectorKeyByElement.delete(entry.element);
    this._detachConnectorFromNode(cacheKey, entry.nodeId);

    if (this._nodeEntries.has(entry.nodeId)) {
      this.invalidateNode(entry.nodeId, 'connector-unregistered');
    }
  }

  public updateRectByElement(element: HTMLElement | SVGElement, rect: IRect | IRoundedRect): void {
    const nodeId = this._nodeIdByElement.get(element);
    if (nodeId) {
      const node = this._nodeEntries.get(nodeId);
      if (node) {
        node.rect = rect;
      }

      return;
    }

    const connectorKey = this._connectorKeyByElement.get(element);
    if (connectorKey) {
      const connector = this._connectorEntries.get(connectorKey);
      if (connector) {
        connector.rect = rect as IRoundedRect;
      }
    }
  }

  public setNodeRect(nodeId: string, rect: IRect): void {
    const node = this._nodeEntries.get(nodeId);
    if (!node) {
      return;
    }

    const previousRect = node.rect;
    node.rect = RectExtensions.initialize(rect.x, rect.y, rect.width, rect.height);

    if (!previousRect) {
      return;
    }

    this._updateConnectorRectsByNodeRect(nodeId, previousRect, node.rect);
  }

  public setConnectorRect(connectorId: string, kind: string, rect: IRoundedRect): void {
    const cacheKey = FCacheConnectorKeyFactory.build(connectorId, kind);
    const connector = this._connectorEntries.get(cacheKey);
    if (!connector) {
      return;
    }

    connector.rect = RoundedRect.fromRoundedRect(rect);
  }

  public getCachedRect<T extends IRect>(element: HTMLElement | SVGElement): T | undefined {
    return (this.getNodeRectByElement(element) ?? this.getConnectorRectByElement(element)) as
      | T
      | undefined;
  }

  public getNodeRectByElement(element: HTMLElement | SVGElement): IRect | undefined {
    const nodeId = this._nodeIdByElement.get(element);
    if (!nodeId) {
      return undefined;
    }

    return this._nodeEntries.get(nodeId)?.rect ?? undefined;
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

  private _updateConnectorRectsByNodeRect(
    nodeId: string,
    previousRect: IRect,
    nextRect: IRect,
  ): void {
    const connectorKeys = this._connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }

    const dx = nextRect.x - previousRect.x;
    const dy = nextRect.y - previousRect.y;

    const hasScaleX = previousRect.width !== 0;
    const hasScaleY = previousRect.height !== 0;
    const scaleX = hasScaleX ? nextRect.width / previousRect.width : 1;
    const scaleY = hasScaleY ? nextRect.height / previousRect.height : 1;

    for (const connectorKey of connectorKeys) {
      const connector = this._connectorEntries.get(connectorKey);
      if (!connector?.rect) {
        continue;
      }

      const prevConnectorRect = connector.rect;
      const prevCenter = prevConnectorRect.gravityCenter;

      const nextCenterX = hasScaleX
        ? nextRect.x + (prevCenter.x - previousRect.x) * scaleX
        : prevCenter.x + dx;
      const nextCenterY = hasScaleY
        ? nextRect.y + (prevCenter.y - previousRect.y) * scaleY
        : prevCenter.y + dy;

      connector.rect = new RoundedRect(
        nextCenterX - prevConnectorRect.width / 2,
        nextCenterY - prevConnectorRect.height / 2,
        prevConnectorRect.width,
        prevConnectorRect.height,
        prevConnectorRect.radius1,
        prevConnectorRect.radius2,
        prevConnectorRect.radius3,
        prevConnectorRect.radius4,
      );
    }
  }
}
