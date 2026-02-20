import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  IPoint,
  IRect,
  IRoundedRect,
  PointExtensions,
  RoundedRect,
  SizeExtensions,
} from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { FComponentsStore } from '../../f-storage';

interface INodeGeometryRef {
  _position: IPoint;
  stateChanges: {
    listen(callback: () => void): () => void;
  };
}

interface IConnectorGeometryRef {
  isConnected: boolean;
  toConnector: unknown[];
}

interface INodeEntry {
  nodeId: string;
  elementRef: HTMLElement | SVGElement;
  nodeRef?: INodeGeometryRef;
  cachedRect: IRoundedRect | null;
  revision: number;
  stale: boolean;
  measuredSpaceRevision: number;
  resizeObserver?: ResizeObserver;
  mutationObserver?: MutationObserver;
  unlistenStateChanges?: () => void;
}

interface IConnectorEntry {
  cacheKey: string;
  connectorId: string;
  kind: string;
  nodeId: string;
  elementRef: HTMLElement | SVGElement;
  connectorRef?: IConnectorGeometryRef;
  cachedRect: IRoundedRect | null;
  revision: number;
  stale: boolean;
  measuredSpaceRevision: number;
  resizeObserver?: ResizeObserver;
}

interface INodeDragSession {
  startPosition: IPoint;
  hadInvalidation: boolean;
}

export interface IGeometryCacheDebugCounters {
  totalBoundingClientRectReads: number;
  boundingClientRectReadsDuringDrag: number;
  activeDragSessions: number;
  spaceRevision: number;
}

const MAX_CONNECTORS_PER_DRAG_REFRESH = 300;

/**
 * Unified geometry cache in flow/canvas space.
 *
 * Coordinate system for cached rects:
 * - x/y/width/height are stored in flow space (unscaled canvas space), not viewport space.
 * - This keeps drag math stable: draggedRect = cachedRect + dragDelta.
 */
@Injectable()
export class FGeometryCache implements OnDestroy {
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);

  private readonly _nodeEntries = new Map<string, INodeEntry>();
  private readonly _connectorEntries = new Map<string, IConnectorEntry>();
  private readonly _connectorKeysByNodeId = new Map<string, Set<string>>();
  private readonly _connectorKeysById = new Map<string, Set<string>>();

  private readonly _nodeIdByElement = new WeakMap<Element, string>();
  private readonly _connectorKeyByElement = new WeakMap<Element, string>();

  private readonly _dragSessions = new Map<string, INodeDragSession>();

  private _spaceRevision = 0;
  private _hasGlobalListeners = false;
  private readonly _cleanupGlobalListeners: (() => void)[] = [];

  private _debugTotalReads = 0;
  private _debugReadsDuringDrag = 0;

  public registerNode(
    nodeId: string,
    elementRef: HTMLElement | SVGElement,
    nodeRef?: INodeGeometryRef,
  ): void {
    this._attachGlobalListenersOnce();

    const previous = this._nodeEntries.get(nodeId);
    if (previous) {
      this._disconnectNodeObservers(previous);
    }

    const next: INodeEntry = {
      nodeId,
      elementRef,
      nodeRef,
      cachedRect: previous?.cachedRect ?? null,
      revision: previous?.revision ?? 0,
      stale: true,
      measuredSpaceRevision: previous?.measuredSpaceRevision ?? -1,
    };

    this._nodeEntries.set(nodeId, next);
    this._nodeIdByElement.set(elementRef, nodeId);
    this._connectorKeysByNodeId.set(nodeId, this._connectorKeysByNodeId.get(nodeId) ?? new Set());

    this._connectNodeObservers(next);
  }

  public unregisterNode(nodeId: string): void {
    this.endDragSession(nodeId);

    const entry = this._nodeEntries.get(nodeId);
    if (!entry) {
      return;
    }

    this._disconnectNodeObservers(entry);
    this._nodeEntries.delete(nodeId);
    this._nodeIdByElement.delete(entry.elementRef);

    const connectorKeys = Array.from(this._connectorKeysByNodeId.get(nodeId) ?? []);
    connectorKeys.forEach((connectorKey) => {
      const connector = this._connectorEntries.get(connectorKey);
      if (!connector) {
        return;
      }

      this.unregisterConnector(connector.connectorId, connector.kind);
    });
    this._connectorKeysByNodeId.delete(nodeId);
  }

  public registerConnector(
    connectorId: string,
    nodeId: string,
    kind: string,
    elementRef: HTMLElement | SVGElement,
    connectorRef?: IConnectorGeometryRef,
  ): void {
    this._attachGlobalListenersOnce();

    const cacheKey = this._buildConnectorCacheKey(connectorId, kind);
    const previous = this._connectorEntries.get(cacheKey);
    if (previous) {
      this._disconnectConnectorObservers(previous);
      this._detachConnectorFromNode(previous.cacheKey, previous.nodeId);
      this._removeConnectorIdIndex(previous.connectorId, previous.cacheKey);
      this._connectorKeyByElement.delete(previous.elementRef);
    }

    const next: IConnectorEntry = {
      cacheKey,
      connectorId,
      kind,
      nodeId,
      elementRef,
      connectorRef,
      cachedRect: previous?.cachedRect ?? null,
      revision: previous?.revision ?? 0,
      stale: true,
      measuredSpaceRevision: previous?.measuredSpaceRevision ?? -1,
    };

    this._connectorEntries.set(cacheKey, next);
    this._connectorKeyByElement.set(elementRef, cacheKey);
    this._addConnectorIdIndex(connectorId, cacheKey);

    const connectorKeys = this._connectorKeysByNodeId.get(nodeId) ?? new Set<string>();
    connectorKeys.add(cacheKey);
    this._connectorKeysByNodeId.set(nodeId, connectorKeys);

    this._connectConnectorObservers(next);
    this.invalidateNode(nodeId, 'connector-registered');
  }

  public unregisterConnector(connectorId: string, kind?: string): void {
    const cacheKey = this._resolveConnectorCacheKey(connectorId, kind);
    if (!cacheKey) {
      return;
    }

    const entry = this._connectorEntries.get(cacheKey);
    if (!entry) {
      return;
    }

    this._disconnectConnectorObservers(entry);
    this._connectorEntries.delete(cacheKey);
    this._connectorKeyByElement.delete(entry.elementRef);
    this._detachConnectorFromNode(cacheKey, entry.nodeId);
    this._removeConnectorIdIndex(entry.connectorId, cacheKey);

    if (this._nodeEntries.has(entry.nodeId)) {
      this.invalidateNode(entry.nodeId, 'connector-unregistered');
    }
  }

  public getNodeRect(nodeId: string): IRect | undefined {
    return this._nodeEntries.get(nodeId)?.cachedRect ?? undefined;
  }

  public getConnectorRect(connectorId: string, kind?: string): IRoundedRect | undefined {
    const cacheKey = this._resolveConnectorCacheKey(connectorId, kind);
    if (!cacheKey) {
      return undefined;
    }

    return this._connectorEntries.get(cacheKey)?.cachedRect ?? undefined;
  }

  public getConnectorsByNode(nodeId: string): string[] {
    return Array.from(this._connectorKeysByNodeId.get(nodeId) ?? [])
      .map((cacheKey) => this._connectorEntries.get(cacheKey)?.connectorId)
      .filter((x): x is string => !!x);
  }

  public resolveNodeIdByElement(element: HTMLElement | SVGElement): string | undefined {
    return this._nodeIdByElement.get(element);
  }

  public resolveConnectorIdByElement(element: HTMLElement | SVGElement): string | undefined {
    const cacheKey = this._connectorKeyByElement.get(element);
    if (!cacheKey) {
      return undefined;
    }

    return this._connectorEntries.get(cacheKey)?.connectorId;
  }

  public invalidateNode(nodeId: string, _reason: string): void {
    const node = this._nodeEntries.get(nodeId);
    if (!node) {
      return;
    }

    node.stale = true;

    const session = this._dragSessions.get(nodeId);
    if (session) {
      session.hadInvalidation = true;
    }

    const connectorKeys = this._connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }

    connectorKeys.forEach((cacheKey) => this._invalidateConnectorInternal(cacheKey, false));
  }

  public invalidateConnector(connectorId: string, _reason: string, kind?: string): void {
    const cacheKey = this._resolveConnectorCacheKey(connectorId, kind);
    if (!cacheKey) {
      return;
    }

    this._invalidateConnectorInternal(cacheKey, true);
  }

  public ensureNodeRectFresh(nodeId: string, strictAgainstSpaceRevision = false): void {
    const nodeEntry = this._nodeEntries.get(nodeId);
    if (!nodeEntry) {
      return;
    }

    if (this._isNodeRectFresh(nodeEntry, strictAgainstSpaceRevision)) {
      return;
    }

    if (this._dragSessions.has(nodeId) && nodeEntry.cachedRect) {
      return;
    }

    this._measureAndStore([nodeEntry], []);
  }

  public ensureConnectorGeometryFresh(
    connectorId: string,
    kindOrStrictAgainstSpaceRevision?: string | boolean,
    strictAgainstSpaceRevision = false,
  ): void {
    const kind =
      typeof kindOrStrictAgainstSpaceRevision === 'string'
        ? kindOrStrictAgainstSpaceRevision
        : undefined;
    const strictRevisionCheck =
      typeof kindOrStrictAgainstSpaceRevision === 'boolean'
        ? kindOrStrictAgainstSpaceRevision
        : strictAgainstSpaceRevision;

    const cacheKey = this._resolveConnectorCacheKey(connectorId, kind);
    if (!cacheKey) {
      return;
    }

    const connectorEntry = this._connectorEntries.get(cacheKey);
    if (!connectorEntry) {
      return;
    }

    if (this._isConnectorRectFresh(connectorEntry, strictRevisionCheck)) {
      return;
    }

    if (this._dragSessions.has(connectorEntry.nodeId) && connectorEntry.cachedRect) {
      return;
    }

    this._measureAndStore([], [connectorEntry]);
  }

  /**
   * Drag-start preflight: refresh node + required connectors only if stale.
   */
  public ensureNodeGeometryFresh(nodeId: string): void {
    const nodeEntry = this._nodeEntries.get(nodeId);
    if (!nodeEntry) {
      return;
    }

    const connectorKeys = this._selectConnectorsForDrag(nodeId);
    const connectorEntries = connectorKeys
      .map((cacheKey) => this._connectorEntries.get(cacheKey))
      .filter((x): x is IConnectorEntry => !!x);

    const isNodeFresh = this._isNodeRectFresh(nodeEntry, true);
    const areConnectorsFresh = connectorEntries.every((entry) =>
      this._isConnectorRectFresh(entry, true),
    );

    if (isNodeFresh && areConnectorsFresh) {
      return;
    }

    this._measureAndStore([nodeEntry], connectorEntries);
  }

  /**
   * Full node refresh: node rect + all its connectors.
   */
  public refreshNodeGeometry(nodeId: string): void {
    if (this._dragSessions.has(nodeId)) {
      return;
    }

    const nodeEntry = this._nodeEntries.get(nodeId);
    if (!nodeEntry) {
      return;
    }

    const connectorEntries = Array.from(this._connectorKeysByNodeId.get(nodeId) ?? [])
      .map((cacheKey) => this._connectorEntries.get(cacheKey))
      .filter((x): x is IConnectorEntry => !!x);

    this._measureAndStore([nodeEntry], connectorEntries);
  }

  /**
   * Refreshes specific node/connector ids in one read phase.
   * Measurements are suppressed while any node drag session is active.
   */
  public refreshBatch(ids: string[]): void {
    if (!ids.length || this._dragSessions.size) {
      return;
    }

    const nodeEntries: INodeEntry[] = [];
    const connectorEntries: IConnectorEntry[] = [];
    const connectorKeysToRefresh = new Set<string>();

    for (const id of ids) {
      const nodeEntry = this._nodeEntries.get(id);
      if (nodeEntry) {
        nodeEntries.push(nodeEntry);
        continue;
      }

      const connectorKeys = this._connectorKeysById.get(id);
      if (!connectorKeys?.size) {
        continue;
      }

      for (const cacheKey of connectorKeys) {
        if (connectorKeysToRefresh.has(cacheKey)) {
          continue;
        }

        connectorKeysToRefresh.add(cacheKey);
        const connectorEntry = this._connectorEntries.get(cacheKey);
        if (connectorEntry) {
          connectorEntries.push(connectorEntry);
        }
      }
    }

    this._measureAndStore(nodeEntries, connectorEntries);
  }

  public beginDragSession(nodeId: string): void {
    if (this._dragSessions.has(nodeId)) {
      return;
    }

    const nodeEntry = this._nodeEntries.get(nodeId);
    if (!nodeEntry) {
      return;
    }

    if (!nodeEntry.cachedRect) {
      this.ensureNodeGeometryFresh(nodeId);
    }

    this._dragSessions.set(nodeId, {
      startPosition: this._readNodePosition(nodeEntry),
      hadInvalidation: false,
    });
  }

  public endDragSession(nodeId: string): void {
    const session = this._dragSessions.get(nodeId);
    if (!session) {
      return;
    }

    const nodeEntry = this._nodeEntries.get(nodeId);

    if (nodeEntry?.cachedRect) {
      const currentPosition = this._readNodePosition(nodeEntry);
      const delta = PointExtensions.sub(currentPosition, session.startPosition);

      if (delta.x || delta.y) {
        nodeEntry.cachedRect = this._translateRect(nodeEntry.cachedRect, delta);
        nodeEntry.revision++;

        const connectorKeys = this._connectorKeysByNodeId.get(nodeId);
        connectorKeys?.forEach((cacheKey) => {
          const connector = this._connectorEntries.get(cacheKey);
          if (!connector?.cachedRect) {
            return;
          }

          connector.cachedRect = this._translateRect(connector.cachedRect, delta);
          connector.revision++;
          if (!session.hadInvalidation) {
            connector.stale = false;
            connector.measuredSpaceRevision = this._spaceRevision;
          }
        });
      }

      nodeEntry.measuredSpaceRevision = this._spaceRevision;
    }

    if (session.hadInvalidation) {
      if (nodeEntry) {
        nodeEntry.stale = true;
      }
    } else {
      if (nodeEntry) {
        nodeEntry.stale = false;
      }
    }

    this._dragSessions.delete(nodeId);
  }

  public getDebugCounters(): IGeometryCacheDebugCounters {
    return {
      totalBoundingClientRectReads: this._debugTotalReads,
      boundingClientRectReadsDuringDrag: this._debugReadsDuringDrag,
      activeDragSessions: this._dragSessions.size,
      spaceRevision: this._spaceRevision,
    };
  }

  public resetDebugCounters(): void {
    this._debugTotalReads = 0;
    this._debugReadsDuringDrag = 0;
  }

  public ngOnDestroy(): void {
    this._nodeEntries.forEach((entry) => this._disconnectNodeObservers(entry));
    this._connectorEntries.forEach((entry) => this._disconnectConnectorObservers(entry));

    this._cleanupGlobalListeners.forEach((cleanup) => cleanup());
    this._cleanupGlobalListeners.length = 0;
  }

  private _attachGlobalListenersOnce(): void {
    if (this._hasGlobalListeners || !this._browser.isBrowser()) {
      return;
    }

    const markSpaceAsChanged = () => {
      this._spaceRevision++;
    };

    const unlistenTransform = this._store.transformChanges$.listen(markSpaceAsChanged);
    this._cleanupGlobalListeners.push(unlistenTransform);

    const onScroll = () => markSpaceAsChanged();
    const onResize = () => markSpaceAsChanged();

    this._browser.document.addEventListener('scroll', onScroll, true);

    const windowRef = this._browser.document.defaultView;
    windowRef?.addEventListener('resize', onResize, true);

    this._cleanupGlobalListeners.push(() =>
      this._browser.document.removeEventListener('scroll', onScroll, true),
    );
    this._cleanupGlobalListeners.push(() =>
      windowRef?.removeEventListener('resize', onResize, true),
    );

    this._hasGlobalListeners = true;
  }

  private _connectNodeObservers(entry: INodeEntry): void {
    if (!this._browser.isBrowser()) {
      return;
    }

    entry.resizeObserver = new ResizeObserver(() => {
      this.invalidateNode(entry.nodeId, 'node-resize');
    });
    entry.resizeObserver.observe(entry.elementRef);

    entry.mutationObserver = new MutationObserver((records) => {
      if (records.some((x) => x.type === 'childList')) {
        this.invalidateNode(entry.nodeId, 'node-mutation');
      }
    });
    entry.mutationObserver.observe(entry.elementRef, {
      childList: true,
      subtree: true,
    });

    if (entry.nodeRef) {
      entry.unlistenStateChanges = entry.nodeRef.stateChanges.listen(() => {
        this.invalidateNode(entry.nodeId, 'node-state-change');
      });
    }
  }

  private _disconnectNodeObservers(entry: INodeEntry): void {
    entry.resizeObserver?.disconnect();
    entry.resizeObserver = undefined;

    entry.mutationObserver?.disconnect();
    entry.mutationObserver = undefined;

    entry.unlistenStateChanges?.();
    entry.unlistenStateChanges = undefined;
  }

  private _connectConnectorObservers(entry: IConnectorEntry): void {
    if (!this._browser.isBrowser()) {
      return;
    }

    entry.resizeObserver = new ResizeObserver(() => {
      this._invalidateConnectorInternal(entry.cacheKey, true);
    });

    entry.resizeObserver.observe(entry.elementRef);
  }

  private _disconnectConnectorObservers(entry: IConnectorEntry): void {
    entry.resizeObserver?.disconnect();
    entry.resizeObserver = undefined;
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

    connector.stale = true;

    if (markNodeAsStale) {
      const node = this._nodeEntries.get(connector.nodeId);
      if (node) {
        node.stale = true;
      }
    }

    const session = this._dragSessions.get(connector.nodeId);
    if (session) {
      session.hadInvalidation = true;
    }
  }

  private _buildConnectorCacheKey(connectorId: string, kind: string): string {
    // Connector ids may overlap between input/output/outlet registries.
    // Cache key is namespaced by connector kind to keep entries unambiguous.
    return `${kind}::${connectorId}`;
  }

  private _resolveConnectorCacheKey(connectorId: string, kind?: string): string | undefined {
    if (kind) {
      return this._buildConnectorCacheKey(connectorId, kind);
    }

    const connectorKeys = Array.from(this._connectorKeysById.get(connectorId) ?? []);
    if (connectorKeys.length !== 1) {
      return undefined;
    }

    return connectorKeys[0];
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

  private _selectConnectorsForDrag(nodeId: string): string[] {
    const allConnectorKeys = Array.from(this._connectorKeysByNodeId.get(nodeId) ?? []);

    if (allConnectorKeys.length <= MAX_CONNECTORS_PER_DRAG_REFRESH) {
      return allConnectorKeys;
    }

    const connectedIds = allConnectorKeys.filter((cacheKey) => {
      const entry = this._connectorEntries.get(cacheKey);
      if (!entry?.connectorRef) {
        return false;
      }

      return entry.connectorRef.isConnected || entry.connectorRef.toConnector.length > 0;
    });

    if (connectedIds.length) {
      return connectedIds;
    }

    return allConnectorKeys.slice(0, MAX_CONNECTORS_PER_DRAG_REFRESH);
  }

  private _isNodeRectFresh(entry: INodeEntry, strictAgainstSpaceRevision: boolean): boolean {
    if (!entry.cachedRect || entry.stale) {
      return false;
    }

    return !strictAgainstSpaceRevision || entry.measuredSpaceRevision === this._spaceRevision;
  }

  private _isConnectorRectFresh(
    entry: IConnectorEntry,
    strictAgainstSpaceRevision: boolean,
  ): boolean {
    if (!entry.cachedRect || entry.stale) {
      return false;
    }

    return !strictAgainstSpaceRevision || entry.measuredSpaceRevision === this._spaceRevision;
  }

  private _measureAndStore(
    nodeEntries: readonly INodeEntry[],
    connectorEntries: readonly IConnectorEntry[],
  ): void {
    if (!nodeEntries.length && !connectorEntries.length) {
      return;
    }

    if (!this._browser.isBrowser() || !this._store.flowHost || !this._store.fCanvas) {
      return;
    }

    const transform = this._store.transform;
    const scale = transform.scale || 1;
    const transformOffsetX = transform.position.x + transform.scaledPosition.x;
    const transformOffsetY = transform.position.y + transform.scaledPosition.y;

    const flowHostRect = this._measureBoundingRect(this._store.flowHost);

    const nodeRects = new Map<string, DOMRect>();
    const connectorRects = new Map<string, DOMRect>();

    for (const entry of nodeEntries) {
      nodeRects.set(entry.nodeId, this._measureBoundingRect(entry.elementRef));
    }

    for (const entry of connectorEntries) {
      connectorRects.set(entry.cacheKey, this._measureBoundingRect(entry.elementRef));
    }

    for (const entry of nodeEntries) {
      const rect = nodeRects.get(entry.nodeId);
      if (!rect) {
        continue;
      }

      entry.cachedRect = this._viewportRectToFlowRect(
        rect,
        entry.elementRef,
        flowHostRect,
        scale,
        transformOffsetX,
        transformOffsetY,
      );
      entry.revision++;
      entry.stale = false;
      entry.measuredSpaceRevision = this._spaceRevision;
    }

    for (const entry of connectorEntries) {
      const rect = connectorRects.get(entry.cacheKey);
      if (!rect) {
        continue;
      }

      entry.cachedRect = this._viewportRectToFlowRect(
        rect,
        entry.elementRef,
        flowHostRect,
        scale,
        transformOffsetX,
        transformOffsetY,
      );
      entry.revision++;
      entry.stale = false;
      entry.measuredSpaceRevision = this._spaceRevision;
    }
  }

  private _measureBoundingRect(element: HTMLElement | SVGElement): DOMRect {
    const rect = element.getBoundingClientRect();

    this._debugTotalReads++;

    if (this._dragSessions.size) {
      this._debugReadsDuringDrag++;
    }

    return rect;
  }

  private _viewportRectToFlowRect(
    viewportRect: DOMRect,
    element: HTMLElement | SVGElement,
    flowHostRect: DOMRect,
    scale: number,
    transformOffsetX: number,
    transformOffsetY: number,
  ): IRoundedRect {
    const normalizedX = (viewportRect.left - flowHostRect.left - transformOffsetX) / scale;
    const normalizedY = (viewportRect.top - flowHostRect.top - transformOffsetY) / scale;

    const unscaledSize = SizeExtensions.initialize(
      viewportRect.width / scale,
      viewportRect.height / scale,
    );

    const offsetSize = SizeExtensions.offsetFromElement(element) || unscaledSize;

    const unscaledRect = new RoundedRect(
      normalizedX,
      normalizedY,
      unscaledSize.width,
      unscaledSize.height,
      0,
      0,
      0,
      0,
    );

    return RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
  }

  private _readNodePosition(entry: INodeEntry): IPoint {
    const nodeRef = entry.nodeRef ?? this._store.nodes.get(entry.nodeId);
    if (!nodeRef) {
      return PointExtensions.initialize();
    }

    return PointExtensions.initialize(nodeRef._position.x, nodeRef._position.y);
  }

  private _translateRect(rect: IRoundedRect, delta: IPoint): IRoundedRect {
    return RoundedRect.fromRoundedRect(rect).addPoint(delta);
  }
}
