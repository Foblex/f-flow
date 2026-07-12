import { computed, inject, Injectable, signal } from '@angular/core';
import { IPoint, IRect } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import type {
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FDeleteSelectedEvent,
  FDropToGroupEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
} from '../../f-draggable';
import { F_FLOW_STATE_CONFIG } from './i-f-flow-state';
import {
  IFStateConnection,
  IFStateData,
  IFStateGroup,
  IFStateNode,
  IFStateTransform,
} from './i-f-state-models';

/** The selected items, mirrored from the flow. */
export interface IFStateSelection {
  nodeIds: string[];
  groupIds: string[];
  connectionIds: string[];
}

/** The whole graph at one point in time; records are updated immutably. */
export interface IFStateShape<
  TNode extends IFStateNode = IFStateNode,
  TConnection extends IFStateConnection = IFStateConnection,
  TGroup extends IFStateGroup = IFStateGroup,
> {
  nodes: Record<string, TNode>;
  groups: Record<string, TGroup>;
  connections: Record<string, TConnection>;
  /** Selection is part of the shape only when `selectionInHistory` is on. */
  selection: IFStateSelection;
  /** Canvas pan/zoom; part of the shape only when `canvasTransformInHistory` is on. */
  transform: IFStateTransform;
}

const EMPTY_SELECTION = Object.freeze({
  nodeIds: [],
  groupIds: [],
  connectionIds: [],
}) as IFStateSelection;

const DEFAULT_TRANSFORM = Object.freeze({
  position: undefined,
  scale: 1,
}) as IFStateTransform;

/**
 * The data store of the state plugin (`provideFFlow(withFlowState())`).
 *
 * Holds the whole graph as plain records behind the signals `nodes`,
 * `groups` and `connections` that the template renders with `@for`. Records
 * are your own shape — extend `IFStateNode`/`IFStateGroup`/`IFStateConnection`
 * with any fields and type them through `injectFlowState<MyNode>()`; the store
 * only reads the framework keys and carries the rest through untouched.
 *
 * Every mutation — its own methods or the gestures `FFlowStateController`
 * forwards into the `apply*` handlers — is ONE undoable history step: records
 * are updated immutably, so a history entry is just the previous shape
 * reference. `undo`/`redo` with `canUndo`/`canRedo` signals come built in;
 * `changes` ticks once when a standalone mutation or outer batch settles, so a
 * single effect can persist the graph. Load data with `load(...)`, take it back
 * with `snapshot()`.
 *
 * EVERY method is designed for overriding. Subclass the store, override any
 * CRUD method, any `apply*` gesture handler or any protected building block,
 * and install the subclass via `withFlowState({ stateClass: MyFlowState })` —
 * the auto-wiring and the templates then use your behavior.
 */
@Injectable()
export class FFlowState<
  TNode extends IFStateNode = IFStateNode,
  TConnection extends IFStateConnection = IFStateConnection,
  TGroup extends IFStateGroup = IFStateGroup,
> {
  protected readonly config = inject(F_FLOW_STATE_CONFIG, { optional: true });

  /**
   * Resolves the node owning a connector; installed by the controller from
   * the live registries so node removal can cascade to attached connections.
   */
  public _connectorOwnerResolver: ((connectorId: string) => string | undefined) | null = null;

  private readonly _shape = signal<IFStateShape<TNode, TConnection, TGroup>>({
    nodes: {},
    groups: {},
    connections: {},
    selection: EMPTY_SELECTION,
    transform: DEFAULT_TRANSFORM,
  });
  private readonly _undoStack: IFStateShape<TNode, TConnection, TGroup>[] = [];
  private readonly _redoStack: IFStateShape<TNode, TConnection, TGroup>[] = [];
  private readonly _canUndo = signal(false);
  private readonly _canRedo = signal(false);
  private readonly _changes = signal(0);
  /** Live selection when `selectionInHistory` is off (kept out of history). */
  private readonly _liveSelection = signal<IFStateSelection>(EMPTY_SELECTION);
  /** Live transform when `canvasTransformInHistory` is off (kept out of history). */
  private readonly _liveTransform = signal<IFStateTransform>(DEFAULT_TRANSFORM);
  /** Called when `undo` empties the history; the controller may reset the view. */
  public _onUndoToStart: (() => void) | null = null;

  /** Open-transaction depth; commits inside a batch collapse into one step. */
  private _batchDepth = 0;
  private _batchOpen = false;
  /** A mutation occurred inside the current outer batch. */
  private _batchDirty = false;

  // Records are memoized so a selection-only change never re-emits the graph.
  private readonly _nodesRecord = computed(() => this._shape().nodes);
  private readonly _groupsRecord = computed(() => this._shape().groups);
  private readonly _connectionsRecord = computed(() => this._shape().connections);

  /** All nodes, re-emitted after every mutation, undo and redo. */
  public readonly nodes = computed(() => Object.values(this._nodesRecord()));

  /** All groups, re-emitted after every mutation, undo and redo. */
  public readonly groups = computed(() => Object.values(this._groupsRecord()));

  /** All connections, re-emitted after every mutation, undo and redo. */
  public readonly connections = computed(() => Object.values(this._connectionsRecord()));

  /** The current selection; historized only when `selectionInHistory` is on. */
  public readonly selection = computed(() =>
    this.config?.selectionInHistory ? this._shape().selection : this._liveSelection(),
  );

  /** The current canvas transform; historized only when `canvasTransformInHistory` is on. */
  public readonly transform = computed(() =>
    this.config?.canvasTransformInHistory ? this._shape().transform : this._liveTransform(),
  );

  /** Ticks when a standalone mutation or outer batch settles, and on `load`. */
  public readonly changes = this._changes.asReadonly();

  public readonly canUndo = this._canUndo.asReadonly();

  public readonly canRedo = this._canRedo.asReadonly();

  // ------------------------------------------------------------------
  // Data in / data out
  // ------------------------------------------------------------------

  /** Replaces the whole graph and resets the undo history. */
  public load(data: Partial<IFStateData<TNode, TConnection, TGroup>>): void {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this._batchDirty = false;
    const transform = _copyTransform(data.transform ?? DEFAULT_TRANSFORM);
    this._liveSelection.set(EMPTY_SELECTION);
    this._liveTransform.set(transform);
    this._shape.set({
      nodes: _byId(data.nodes ?? []),
      groups: _byId(data.groups ?? []),
      connections: _byId(data.connections ?? []),
      selection: EMPTY_SELECTION,
      transform,
    });
    this._syncHistorySignals();
    this._bumpChanges();
  }

  /**
   * The whole graph as plain arrays — safe to persist. Records and their
   * geometry are copied; nested payloads stay yours by reference.
   */
  public snapshot(): IFStateData<TNode, TConnection, TGroup> {
    const { nodes, groups, connections } = this._shape();

    return {
      nodes: Object.values(nodes).map(_copyBox),
      groups: Object.values(groups).map(_copyBox),
      connections: Object.values(connections).map((connection) => ({ ...connection })),
      transform: _copyTransform(this.transform()),
    };
  }

  public getNode(id: string): TNode | undefined {
    return this._shape().nodes[id];
  }

  public getGroup(id: string): TGroup | undefined {
    return this._shape().groups[id];
  }

  public getConnection(id: string): TConnection | undefined {
    return this._shape().connections[id];
  }

  // ------------------------------------------------------------------
  // Mutations — each call is ONE undoable history step
  // ------------------------------------------------------------------

  public addNodes(...nodes: TNode[]): void {
    if (!nodes.length) {
      return;
    }

    const shape = this.currentShape();
    this.commit({ ...shape, nodes: { ...shape.nodes, ..._byId(nodes) } });
  }

  /** Shallow-merges the patch into the node: provided keys replace as a whole. */
  public updateNode(id: string, patch: Partial<Omit<TNode, 'id'>>): void {
    const shape = this.currentShape();
    const existing = shape.nodes[id];
    if (!existing) {
      return;
    }

    this.commit({
      ...shape,
      nodes: { ...shape.nodes, [id]: { ...existing, ...patch, id } },
    });
  }

  /**
   * Applies new positions to known nodes and groups as ONE history step. A
   * dragged group arrives here alongside nodes, so both maps are updated.
   */
  public moveNodes(positions: { id: string; position: IPoint }[]): void {
    const shape = this.currentShape();
    let nodes = shape.nodes;
    let groups = shape.groups;
    let changed = false;

    for (const { id, position } of positions) {
      if (shape.nodes[id]) {
        if (nodes === shape.nodes) {
          nodes = { ...shape.nodes };
        }
        nodes[id] = { ...nodes[id], position: { ...position } };
        changed = true;
      } else if (shape.groups[id]) {
        if (groups === shape.groups) {
          groups = { ...shape.groups };
        }
        groups[id] = { ...groups[id], position: { ...position } };
        changed = true;
      }
    }

    if (!changed) {
      return;
    }
    this.commit({ ...shape, nodes, groups });
  }

  /**
   * Removes nodes and, when the connector-owner resolver is available (the
   * plugin is attached to a rendered flow), every connection attached to them
   * — all as ONE history step.
   */
  public removeNodes(ids: string[]): void {
    this.applyRemoval({ nodeIds: ids });
  }

  public addGroups(...groups: TGroup[]): void {
    if (!groups.length) {
      return;
    }

    const shape = this.currentShape();
    this.commit({ ...shape, groups: { ...shape.groups, ..._byId(groups) } });
  }

  /** Shallow-merges the patch into the group. */
  public updateGroup(id: string, patch: Partial<Omit<TGroup, 'id'>>): void {
    const shape = this.currentShape();
    const existing = shape.groups[id];
    if (!existing) {
      return;
    }

    this.commit({
      ...shape,
      groups: { ...shape.groups, [id]: { ...existing, ...patch, id } },
    });
  }

  /** Removes groups (with connection cascade and child un-parenting) as ONE step. */
  public removeGroups(ids: string[]): void {
    this.applyRemoval({ groupIds: ids });
  }

  public addConnections(...connections: TConnection[]): void {
    if (!connections.length) {
      return;
    }

    const shape = this.currentShape();
    this.commit({
      ...shape,
      connections: { ...shape.connections, ..._byId(connections) },
    });
  }

  /** Shallow-merges the patch into the connection. */
  public updateConnection(id: string, patch: Partial<Omit<TConnection, 'id'>>): void {
    const shape = this.currentShape();
    const existing = shape.connections[id];
    if (!existing) {
      return;
    }

    this.commit({
      ...shape,
      connections: { ...shape.connections, [id]: { ...existing, ...patch, id } },
    });
  }

  public removeConnections(ids: string[]): void {
    this.applyRemoval({ connectionIds: ids });
  }

  /** Removes nodes (with connection cascade) and explicit connections as ONE history step. */
  public removeItems(nodeIds: string[], connectionIds: string[]): void {
    this.applyRemoval({ nodeIds, connectionIds });
  }

  // ------------------------------------------------------------------
  // History
  // ------------------------------------------------------------------

  public undo(): void {
    const previous = this._undoStack.pop();
    if (!previous) {
      return;
    }

    this._redoStack.push(this._shape());
    this._shape.set(previous);
    this._syncHistorySignals();
    this._bumpChanges();

    if (!this._canUndo()) {
      this._onUndoToStart?.();
    }
  }

  public redo(): void {
    const next = this._redoStack.pop();
    if (!next) {
      return;
    }

    this._undoStack.push(this._shape());
    this._shape.set(next);
    this._syncHistorySignals();
    this._bumpChanges();
  }

  public clearHistory(): void {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this._syncHistorySignals();
  }

  // ------------------------------------------------------------------
  // Transactions — collapse several mutations into ONE undoable step
  // ------------------------------------------------------------------

  /**
   * Opens a transaction: every `commit` until the matching `endBatch` records
   * only ONE history step (the shape before the batch). Used by the controller
   * to fold the events of a single drag session (e.g. move + drop-to-group, or
   * a historized selection + move) into one undoable action. Nestable.
   */
  public beginBatch(): void {
    this._batchDepth++;
  }

  /** Closes the transaction opened by `beginBatch`. */
  public endBatch(): void {
    if (this._batchDepth > 0) {
      this._batchDepth--;
    }
    if (this._batchDepth === 0) {
      this._batchOpen = false;
      if (this._batchDirty) {
        this._batchDirty = false;
        this._bumpChanges();
      }
    }
  }

  /** Runs `work` inside a transaction so all its mutations are one step. */
  public batch<T>(work: () => T): T {
    this.beginBatch();
    try {
      return work();
    } finally {
      this.endBatch();
    }
  }

  // ------------------------------------------------------------------
  // Gesture handlers — the controller forwards finished gestures here.
  // Override any of them to change what a gesture means for your data.
  // ------------------------------------------------------------------

  /** A create-connection gesture finished. Default: add unless dropped to nowhere. */
  public applyCreateConnection(event: FCreateConnectionEvent): void {
    if (!event.targetId) {
      return;
    }

    const connection = this.config?.connectionFactory
      ? this.config.connectionFactory(event)
      : this.createConnectionRecord(event);
    if (connection) {
      this.addConnections(connection as TConnection);
    }
  }

  /** A reassign gesture finished. Default: update the moved endpoint. */
  public applyReassignConnection(event: FReassignConnectionEvent): void {
    if (event.endpoint === 'source' && event.nextSourceId) {
      this.updateConnection(event.connectionId, {
        sourceId: event.nextSourceId,
      } as Partial<Omit<TConnection, 'id'>>);
    } else if (event.endpoint === 'target' && event.nextTargetId) {
      this.updateConnection(event.connectionId, {
        targetId: event.nextTargetId,
      } as Partial<Omit<TConnection, 'id'>>);
    }
  }

  /** A node drag finished. Default: apply all positions as one step. */
  public applyMoveNodes(event: FMoveNodesEvent): void {
    this.moveNodes(event.nodes);
  }

  /** The user requested removal of the selection. Default: remove with cascade. */
  public applyDeleteSelected(event: FDeleteSelectedEvent): void {
    this.applyRemoval({
      nodeIds: event.nodeIds,
      groupIds: event.groupIds,
      connectionIds: event.connectionIds,
    });
  }

  /**
   * Nodes/groups were dropped into a group. Reparents them as one step when
   * `dropToGroup` is enabled; a no-op otherwise (it's off by default). This
   * only touches items that already exist — a brand-new item from a palette is
   * created by `applyCreateNode`, not here.
   */
  public applyDropToGroup(event: FDropToGroupEvent): void {
    if (this.config?.dropToGroup === false) {
      return;
    }

    const shape = this.currentShape();
    let nodes = shape.nodes;
    let groups = shape.groups;
    let changed = false;

    for (const id of event.nodeIds) {
      if (shape.nodes[id]) {
        if (nodes === shape.nodes) {
          nodes = { ...shape.nodes };
        }
        nodes[id] = { ...nodes[id], parentId: event.targetGroupId };
        changed = true;
      } else if (shape.groups[id]) {
        if (groups === shape.groups) {
          groups = { ...shape.groups };
        }
        groups[id] = { ...groups[id], parentId: event.targetGroupId };
        changed = true;
      }
    }

    if (!changed) {
      return;
    }
    this.commit({ ...shape, nodes, groups });
  }

  /** An external item was dropped onto the canvas. Default: add a node for it. */
  public applyCreateNode(event: FCreateNodeEvent): void {
    const node = this.config?.nodeFactory
      ? this.config.nodeFactory(event)
      : this.createNodeRecord(event);
    if (node) {
      this.addNodes(node as TNode);
    }
  }

  /** The flow selection changed. Historized only when `selectionInHistory` is on. */
  public applySelectionChange(event: FSelectionChangeEvent): void {
    const next: IFStateSelection = {
      nodeIds: [...event.nodeIds],
      groupIds: [...event.groupIds],
      connectionIds: [...event.connectionIds],
    };

    if (this.config?.selectionInHistory) {
      this.commit({ ...this.currentShape(), selection: next });
    } else {
      this._liveSelection.set(next);
    }
  }

  /**
   * The canvas was panned or zoomed (`fCanvasChange`). Historized as its own
   * step when `canvasTransformInHistory` is on; otherwise tracked live, out of
   * history. A no-op when the transform is unchanged, so a binding pushing the
   * current value back can't create a redundant step.
   */
  public applyTransform(transform: IFStateTransform): void {
    const next = _copyTransform(transform);

    if (this.config?.canvasTransformInHistory) {
      if (_isSameTransform(this.currentShape().transform, next)) {
        return;
      }
      this.commit({ ...this.currentShape(), transform: next });
    } else {
      if (_isSameTransform(this._liveTransform(), next)) {
        return;
      }
      this._liveTransform.set(next);
    }
  }

  /**
   * A node or group reported a new measured rect (`fNodeSizeChange` /
   * `fGroupSizeChange`) — e.g. a group auto-fitting after a child was added.
   * Folded into the CURRENT shape WITHOUT its own history step, so the resize
   * rides along with the action that triggered it (one `undo` reverts both).
   */
  public applyResize(id: string, rect: IRect): void {
    const shape = this.currentShape();
    const patch = {
      position: { x: rect.x, y: rect.y },
      size: { width: rect.width, height: rect.height },
    };

    if (shape.nodes[id]) {
      if (_isSameGeometry(shape.nodes[id], patch)) {
        return;
      }
      this.amendCurrent({
        ...shape,
        nodes: { ...shape.nodes, [id]: { ...shape.nodes[id], ...patch } },
      });
    } else if (shape.groups[id]) {
      if (_isSameGeometry(shape.groups[id], patch)) {
        return;
      }
      this.amendCurrent({
        ...shape,
        groups: { ...shape.groups, [id]: { ...shape.groups[id], ...patch } },
      });
    }
  }

  // ------------------------------------------------------------------
  // Overridable building blocks
  // ------------------------------------------------------------------

  /** Builds the record for a gesture-created connection. */
  protected createConnectionRecord(event: FCreateConnectionEvent): IFStateConnection | null {
    return {
      id: generateGuid(),
      sourceId: event.sourceId,
      targetId: event.targetId as string,
    };
  }

  /**
   * Builds the record for an external-item drop. The item's `fData` is spread
   * onto the node, so a palette payload becomes the node's own fields. The
   * drop target nests the node only when `dropToGroup` is enabled (off by
   * default); otherwise the node lands at the top level.
   *
   * Position comes from `externalItemRect`, which is already in flow
   * coordinates (pan/zoom corrected) for every drop — over empty canvas or
   * over a node/group alike. (`dropPosition` is the raw pointer position and
   * only present on container drops, so it isn't used here.)
   */
  protected createNodeRecord(event: FCreateNodeEvent): IFStateNode | null {
    return {
      ...(event.data as object),
      id: generateGuid(),
      position: { x: event.externalItemRect.x, y: event.externalItemRect.y },
      parentId: this.config?.dropToGroup === false ? null : (event.targetContainerId ?? null),
    };
  }

  /**
   * Removes nodes, groups and connections as ONE history step: cascades the
   * connections attached to removed nodes/groups, un-parents any child that
   * pointed at a removed group, and prunes the removed ids from the selection.
   */
  protected applyRemoval(items: {
    nodeIds?: string[];
    groupIds?: string[];
    connectionIds?: string[];
  }): void {
    const shape = this.currentShape();
    const removedNodes = new Set((items.nodeIds ?? []).filter((id) => shape.nodes[id]));
    const removedGroups = new Set((items.groupIds ?? []).filter((id) => shape.groups[id]));
    const removedConnections = new Set(
      (items.connectionIds ?? []).filter((id) => shape.connections[id]),
    );
    for (const id of this.cascadeConnectionIds([...removedNodes, ...removedGroups], shape)) {
      removedConnections.add(id);
    }

    if (!removedNodes.size && !removedGroups.size && !removedConnections.size) {
      return;
    }

    const nodes = _clearParent(_without(shape.nodes, removedNodes), removedGroups);
    const groups = _clearParent(_without(shape.groups, removedGroups), removedGroups);
    const connections = _without(shape.connections, removedConnections);
    const selection = _pruneSelection(
      shape.selection,
      removedNodes,
      removedGroups,
      removedConnections,
    );

    this.commit({ nodes, groups, connections, selection, transform: shape.transform });

    if (!this.config?.selectionInHistory) {
      this._liveSelection.set(
        _pruneSelection(this._liveSelection(), removedNodes, removedGroups, removedConnections),
      );
    }
  }

  /** The current shape, for custom mutations in subclasses. */
  protected currentShape(): IFStateShape<TNode, TConnection, TGroup> {
    return this._shape();
  }

  /**
   * Records the current shape into the history and applies the next one.
   * Route custom subclass mutations through here to make them undoable.
   * Inside a `beginBatch`/`endBatch` transaction only the first commit records
   * a history step, so the whole batch undoes in one go.
   */
  protected commit(next: IFStateShape<TNode, TConnection, TGroup>): void {
    if (this._batchDepth === 0 || !this._batchOpen) {
      this._undoStack.push(this._shape());
      const limit = this.config?.historyLimit ?? 50;
      if (this._undoStack.length > limit) {
        this._undoStack.shift();
      }
      this._redoStack.length = 0;
      if (this._batchDepth > 0) {
        this._batchOpen = true;
      }
    }
    this._shape.set(next);
    this._syncHistorySignals();
    this._markChanged();
  }

  /**
   * Replaces the current shape WITHOUT recording a history step, so the change
   * folds into the last committed step. Used by `applyResize`.
   */
  protected amendCurrent(next: IFStateShape<TNode, TConnection, TGroup>): void {
    this._shape.set(next);
    this._markChanged();
  }

  /** Connections attached to the given nodes/groups, per the connector-owner resolver. */
  protected cascadeConnectionIds(
    ownerIds: string[],
    shape: IFStateShape<TNode, TConnection, TGroup>,
  ): string[] {
    const resolver = this._connectorOwnerResolver;
    if (!resolver || !ownerIds.length) {
      return [];
    }

    const removed = new Set(ownerIds);

    return Object.values(shape.connections)
      .filter((connection) => {
        const sourceNode = resolver(connection.sourceId);
        const targetNode = resolver(connection.targetId);

        return (
          (sourceNode !== undefined && removed.has(sourceNode)) ||
          (targetNode !== undefined && removed.has(targetNode))
        );
      })
      .map((connection) => connection.id);
  }

  private _syncHistorySignals(): void {
    this._canUndo.set(this._undoStack.length > 0);
    this._canRedo.set(this._redoStack.length > 0);
  }

  private _markChanged(): void {
    if (this._batchDepth > 0) {
      this._batchDirty = true;

      return;
    }
    this._bumpChanges();
  }

  private _bumpChanges(): void {
    this._changes.update((value) => value + 1);
  }
}

function _byId<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function _without<T>(records: Record<string, T>, ids: Set<string>): Record<string, T> {
  if (!ids.size) {
    return records;
  }

  return Object.fromEntries(Object.entries(records).filter(([id]) => !ids.has(id)));
}

/** Copies a transform so the stored value can't be mutated from outside. */
function _copyTransform(transform: IFStateTransform): IFStateTransform {
  return {
    position: transform.position ? { x: transform.position.x, y: transform.position.y } : undefined,
    scale: transform.scale,
  };
}

function _isSameTransform(a: IFStateTransform, b: IFStateTransform): boolean {
  return _isSamePoint(a.position, b.position) && a.scale === b.scale;
}

function _isSamePoint(a: IPoint | undefined, b: IPoint | undefined): boolean {
  if (!a || !b) {
    // Both unset → same; exactly one set → different.
    return a === b;
  }

  return a.x === b.x && a.y === b.y;
}

/** Copies a box record with fresh geometry; nested payloads stay by reference. */
function _copyBox<T extends { position: IPoint; size?: { width: number; height: number } }>(
  box: T,
): T {
  return {
    ...box,
    position: { ...box.position },
    size: box.size ? { ...box.size } : undefined,
  };
}

/** Clears `parentId` on records that pointed at a removed group. */
function _clearParent<T extends { parentId?: string | null }>(
  records: Record<string, T>,
  removedGroups: Set<string>,
): Record<string, T> {
  if (!removedGroups.size) {
    return records;
  }

  let next = records;
  for (const [id, record] of Object.entries(records)) {
    if (record.parentId != null && removedGroups.has(record.parentId)) {
      if (next === records) {
        next = { ...records };
      }
      next[id] = { ...record, parentId: null };
    }
  }

  return next;
}

/** Drops removed ids from a selection; returns the same reference if unchanged. */
function _pruneSelection(
  selection: IFStateSelection,
  removedNodes: Set<string>,
  removedGroups: Set<string>,
  removedConnections: Set<string>,
): IFStateSelection {
  const nodeIds = selection.nodeIds.filter((id) => !removedNodes.has(id));
  const groupIds = selection.groupIds.filter((id) => !removedGroups.has(id));
  const connectionIds = selection.connectionIds.filter((id) => !removedConnections.has(id));
  if (
    nodeIds.length === selection.nodeIds.length &&
    groupIds.length === selection.groupIds.length &&
    connectionIds.length === selection.connectionIds.length
  ) {
    return selection;
  }

  return { nodeIds, groupIds, connectionIds };
}

function _isSameGeometry(
  record: { position: IPoint; size?: { width: number; height: number } },
  patch: { position: IPoint; size: { width: number; height: number } },
): boolean {
  return (
    record.position.x === patch.position.x &&
    record.position.y === patch.position.y &&
    record.size?.width === patch.size.width &&
    record.size?.height === patch.size.height
  );
}

/**
 * Typed accessor for the state store provided by `withFlowState()`.
 *
 * ```typescript
 * protected readonly state = injectFlowState<MyNode, MyConnection>();
 * ```
 */
export function injectFlowState<
  TNode extends IFStateNode = IFStateNode,
  TConnection extends IFStateConnection = IFStateConnection,
  TGroup extends IFStateGroup = IFStateGroup,
>(): FFlowState<TNode, TConnection, TGroup> {
  return inject(FFlowState) as FFlowState<TNode, TConnection, TGroup>;
}
