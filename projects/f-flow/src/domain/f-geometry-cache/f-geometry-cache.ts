import { Injectable } from '@angular/core';
import { IPoint, IRect, IRoundedRect, PointExtensions, RectExtensions, RoundedRect } from '@foblex/2d';
import { FUniformGridSpatialIndex } from './f-uniform-grid-spatial-index';

/** Metadata for a cached node rectangle (world/canvas space). */
export interface INodeGeometryEntry {
  readonly nodeId: string;
  elementRef: HTMLElement | SVGElement | undefined;
  worldRect: IRect;
  version: number;
  stale: boolean;
  /** Optional model-supplied offset used when DOM is unavailable. */
  modelRect: IRect | undefined;
}

/** Metadata for a cached connector rectangle (world/canvas space). */
export interface IConnectorGeometryEntry {
  readonly connectorId: string;
  readonly nodeId: string;
  elementRef: HTMLElement | SVGElement | undefined;
  worldRect: IRoundedRect;
  version: number;
  stale: boolean;
  /**
   * Optional model-supplied anchor offset relative to the owning node's top-left corner.
   * Used to derive connector position when DOM is absent (LOD0/LOD1).
   */
  anchorOffset: IPoint | undefined;
}

/** Baseline snapshot held for the duration of a drag session. */
interface IDragSession {
  readonly nodeId: string;
  readonly baselineNodeRect: IRect;
  readonly baselineConnectorRects: Map<string, IRoundedRect>;
  currentDelta: IPoint;
  /** Number of DOM measurements taken after beginDragSession was called. */
  domMeasurementsDuringDrag: number;
}

/** Counters exposed for debugging / performance monitoring. */
export interface IGeometryCacheDebugCounters {
  totalDomMeasurements: number;
  domMeasurementsDuringLastDragSession: number;
  trackedNodes: number;
  trackedConnectors: number;
  spatialIndexSize: number;
}

/**
 * FGeometryCache — persistent geometry cache for nodes and connectors.
 *
 * Stores rects in **world/canvas space** so that pan/scroll changes do not
 * invalidate the entire cache (only the viewport ↔ world transform needs updating).
 *
 * Key properties:
 * - Caches node + connector rects between drag sessions.
 * - Provides O(1) rect lookup during drag (delta-only, zero DOM reads).
 * - Falls back to model geometry (anchorOffset) when the DOM is absent
 *   (useful for virtualized / LOD0 nodes).
 * - Maintains a spatial index for efficient visible-node queries over 50k+ nodes.
 */
@Injectable()
export class FGeometryCache {
  private readonly _nodes = new Map<string, INodeGeometryEntry>();
  private readonly _connectors = new Map<string, IConnectorGeometryEntry>();
  private readonly _nodeConnectors = new Map<string, string[]>();
  private readonly _spatialIndex = new FUniformGridSpatialIndex();

  private _activeDragSession: IDragSession | null = null;

  private _totalDomMeasurements = 0;

  // ─── Node registration ────────────────────────────────────────────────────

  public registerNode(nodeId: string, elementRef: HTMLElement | SVGElement | undefined): void {
    const existing = this._nodes.get(nodeId);
    if (existing) {
      existing.elementRef = elementRef;
      existing.stale = true;
    } else {
      this._nodes.set(nodeId, {
        nodeId,
        elementRef,
        worldRect: RectExtensions.initialize(),
        version: 0,
        stale: true,
        modelRect: undefined,
      });
      this._nodeConnectors.set(nodeId, []);
    }
  }

  public unregisterNode(nodeId: string): void {
    const entry = this._nodes.get(nodeId);
    if (!entry) {
      return;
    }
    this._spatialIndex.remove(nodeId);
    this._nodes.delete(nodeId);
    const connectors = this._nodeConnectors.get(nodeId) ?? [];
    for (const cId of connectors) {
      this._connectors.delete(cId);
    }
    this._nodeConnectors.delete(nodeId);
  }

  // ─── Connector registration ───────────────────────────────────────────────

  public registerConnector(
    connectorId: string,
    nodeId: string,
    elementRef: HTMLElement | SVGElement | undefined,
  ): void {
    const existing = this._connectors.get(connectorId);
    if (existing) {
      existing.elementRef = elementRef;
      existing.stale = true;
    } else {
      this._connectors.set(connectorId, {
        connectorId,
        nodeId,
        elementRef,
        worldRect: RoundedRect.fromRect(RectExtensions.initialize()),
        version: 0,
        stale: true,
        anchorOffset: undefined,
      });
      const list = this._nodeConnectors.get(nodeId);
      if (list) {
        list.push(connectorId);
      } else {
        this._nodeConnectors.set(nodeId, [connectorId]);
      }
    }
  }

  public unregisterConnector(connectorId: string): void {
    const entry = this._connectors.get(connectorId);
    if (!entry) {
      return;
    }
    this._connectors.delete(connectorId);
    const list = this._nodeConnectors.get(entry.nodeId);
    if (list) {
      const idx = list.indexOf(connectorId);
      if (idx >= 0) {
        list.splice(idx, 1);
      }
    }
  }

  // ─── Model geometry (no DOM required) ─────────────────────────────────────

  /** Set the world rect from model data (e.g. layout engine, no DOM needed). */
  public setModelNodeRect(nodeId: string, worldRect: IRect): void {
    let entry = this._nodes.get(nodeId);
    if (!entry) {
      this.registerNode(nodeId, undefined);
      entry = this._nodes.get(nodeId)!;
    }
    entry.modelRect = worldRect;
    entry.worldRect = worldRect;
    entry.stale = false;
    entry.version++;
    this._spatialIndex.upsert(nodeId, worldRect);
  }

  /** Set the anchor offset for a connector relative to its owning node's top-left. */
  public setModelConnectorAnchor(connectorId: string, anchorOffset: IPoint): void {
    const entry = this._connectors.get(connectorId);
    if (!entry) {
      return;
    }
    entry.anchorOffset = anchorOffset;
    // If the node has a valid worldRect, recompute connector worldRect from model data.
    const nodeEntry = this._nodes.get(entry.nodeId);
    if (nodeEntry && !nodeEntry.stale) {
      this._applyAnchorOffsetToConnector(entry, nodeEntry.worldRect);
    }
  }

  // ─── Rect getters ─────────────────────────────────────────────────────────

  public getNodeRect(nodeId: string): IRect | undefined {
    const entry = this._nodes.get(nodeId);
    if (!entry) {
      return undefined;
    }
    const session = this._getSessionFor(nodeId);
    if (session) {
      return this._applyDeltaToRect(entry.worldRect, session.currentDelta);
    }
    return entry.worldRect;
  }

  public getConnectorRect(connectorId: string): IRoundedRect | undefined {
    const entry = this._connectors.get(connectorId);
    if (!entry) {
      return undefined;
    }
    const session = this._getSessionFor(entry.nodeId);
    if (session) {
      const baseline =
        session.baselineConnectorRects.get(connectorId) ?? entry.worldRect;
      return RoundedRect.fromRoundedRect(baseline).addPoint(session.currentDelta);
    }
    return entry.worldRect;
  }

  public getConnectorsByNode(nodeId: string): string[] {
    return this._nodeConnectors.get(nodeId) ?? [];
  }

  // ─── Cache update from DOM ─────────────────────────────────────────────────

  /**
   * Store a freshly-measured node rect (world/canvas space).
   * Called by `EnsureNodeGeometryFreshExecution` after a DOM read.
   */
  public setNodeRect(nodeId: string, worldRect: IRect): void {
    let entry = this._nodes.get(nodeId);
    if (!entry) {
      this.registerNode(nodeId, undefined);
      entry = this._nodes.get(nodeId)!;
    }
    this._totalDomMeasurements++;
    if (this._activeDragSession) {
      this._activeDragSession.domMeasurementsDuringDrag++;
    }
    entry.worldRect = worldRect;
    entry.stale = false;
    entry.version++;
    this._spatialIndex.upsert(nodeId, worldRect);
  }

  /**
   * Store a freshly-measured connector rect (world/canvas space).
   * Called by `EnsureNodeGeometryFreshExecution` after a DOM read.
   */
  public setConnectorRect(connectorId: string, worldRect: IRoundedRect): void {
    let entry = this._connectors.get(connectorId);
    if (!entry) {
      return;
    }
    this._totalDomMeasurements++;
    if (this._activeDragSession) {
      this._activeDragSession.domMeasurementsDuringDrag++;
    }
    entry.worldRect = worldRect;
    entry.stale = false;
    entry.version++;
  }

  // ─── Staleness ────────────────────────────────────────────────────────────

  public invalidateNode(nodeId: string): void {
    const entry = this._nodes.get(nodeId);
    if (entry) {
      entry.stale = true;
    }
    for (const cId of this._nodeConnectors.get(nodeId) ?? []) {
      const c = this._connectors.get(cId);
      if (c) {
        c.stale = true;
      }
    }
  }

  public isNodeStale(nodeId: string): boolean {
    return this._nodes.get(nodeId)?.stale ?? true;
  }

  public hasNodeDom(nodeId: string): boolean {
    return !!this._nodes.get(nodeId)?.elementRef;
  }

  /** Returns the nodeId that owns the given connector, or `undefined` if not found. */
  public getConnectorNodeId(connectorId: string): string | undefined {
    return this._connectors.get(connectorId)?.nodeId;
  }

  // ─── Drag session ─────────────────────────────────────────────────────────

  public beginDragSession(nodeId: string): void {
    const nodeEntry = this._nodes.get(nodeId);
    if (!nodeEntry) {
      return;
    }
    const baselineConnectorRects = new Map<string, IRoundedRect>();
    for (const cId of this._nodeConnectors.get(nodeId) ?? []) {
      const c = this._connectors.get(cId);
      if (c) {
        baselineConnectorRects.set(cId, c.worldRect);
      }
    }
    this._activeDragSession = {
      nodeId,
      baselineNodeRect: { ...nodeEntry.worldRect },
      baselineConnectorRects,
      currentDelta: PointExtensions.initialize(),
      domMeasurementsDuringDrag: 0,
    };
  }

  public updateDragDelta(nodeId: string, delta: IPoint): void {
    if (this._activeDragSession?.nodeId === nodeId) {
      this._activeDragSession.currentDelta = delta;
    }
  }

  /**
   * End the drag session.
   * @param nodeId - the node being dragged
   * @param commit - when `true`, apply the final delta to the cached rects so the
   *                 cache remains fresh without a DOM re-read.
   *                 When `false`, mark node + connectors stale so the next read
   *                 triggers a refresh.
   */
  public endDragSession(nodeId: string, commit: boolean): void {
    const session = this._activeDragSession;
    if (!session || session.nodeId !== nodeId) {
      this._activeDragSession = null;
      return;
    }

    const delta = session.currentDelta;

    if (commit) {
      // Apply the final delta to all cached rects.
      const nodeEntry = this._nodes.get(nodeId);
      if (nodeEntry) {
        const moved = this._applyDeltaToRect(session.baselineNodeRect, delta);
        nodeEntry.worldRect = moved;
        nodeEntry.version++;
        nodeEntry.stale = false;
        this._spatialIndex.upsert(nodeId, moved);
      }
      for (const [cId, baseRect] of session.baselineConnectorRects) {
        const c = this._connectors.get(cId);
        if (c) {
          c.worldRect = RoundedRect.fromRoundedRect(baseRect).addPoint(delta);
          c.version++;
          c.stale = false;
        }
      }
    } else {
      this.invalidateNode(nodeId);
    }

    this._activeDragSession = null;
  }

  // ─── Spatial index ────────────────────────────────────────────────────────

  /** Query node IDs whose cached world rects potentially intersect visibleRect. */
  public queryVisibleNodes(visibleRect: IRect): string[] {
    return this._spatialIndex.query(visibleRect);
  }

  // ─── Clear ────────────────────────────────────────────────────────────────

  public clear(): void {
    this._nodes.clear();
    this._connectors.clear();
    this._nodeConnectors.clear();
    this._spatialIndex.clear();
    this._activeDragSession = null;
  }

  // ─── Debug ────────────────────────────────────────────────────────────────

  public debugCounters(): IGeometryCacheDebugCounters {
    return {
      totalDomMeasurements: this._totalDomMeasurements,
      domMeasurementsDuringLastDragSession:
        this._activeDragSession?.domMeasurementsDuringDrag ?? 0,
      trackedNodes: this._nodes.size,
      trackedConnectors: this._connectors.size,
      spatialIndexSize: this._spatialIndex.size(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private _getSessionFor(nodeId: string): IDragSession | null {
    return this._activeDragSession?.nodeId === nodeId ? this._activeDragSession : null;
  }

  private _applyDeltaToRect(rect: IRect, delta: IPoint): IRect {
    return RectExtensions.initialize(
      rect.x + delta.x,
      rect.y + delta.y,
      rect.width,
      rect.height,
    );
  }

  private _applyAnchorOffsetToConnector(
    entry: IConnectorGeometryEntry,
    nodeWorldRect: IRect,
  ): void {
    if (!entry.anchorOffset) {
      return;
    }
    const ax = nodeWorldRect.x + entry.anchorOffset.x;
    const ay = nodeWorldRect.y + entry.anchorOffset.y;
    entry.worldRect = new RoundedRect(
      ax,
      ay,
      entry.worldRect.width,
      entry.worldRect.height,
      entry.worldRect.radius1,
      entry.worldRect.radius2,
      entry.worldRect.radius3,
      entry.worldRect.radius4,
    );
    entry.stale = false;
    entry.version++;
  }
}
