import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import type {
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FDeleteSelectedEvent,
  FDropToGroupEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
} from '../../f-draggable';
import { F_FLOW_STATE_CONFIG } from './i-f-flow-state';
import { IFStateConnection, IFStateData, IFStateNode } from './i-f-state-models';

/** The whole graph at one point in time; records are updated immutably. */
export interface IFStateShape {
  nodes: Record<string, IFStateNode>;
  connections: Record<string, IFStateConnection>;
}

/**
 * The data store of the state plugin (`provideFFlow(withFlowState())`).
 *
 * Holds the whole graph as plain records behind two signals, `nodes` and
 * `connections`, that the template renders with `@for`. Every mutation — its
 * own methods or the gestures `FFlowStateController` forwards into the
 * `apply*` handlers — is ONE undoable history step: records are updated
 * immutably, so a history entry is just the previous shape reference.
 * `undo`/`redo` with `canUndo`/`canRedo` signals come built in; load data
 * with `load(...)`, take it back with `snapshot()`.
 *
 * EVERY method is designed for overriding. Subclass the store, override any
 * CRUD method, any `apply*` gesture handler or any protected building block,
 * and install the subclass via `withFlowState({ stateClass: MyFlowState })` —
 * the auto-wiring and the templates then use your behavior.
 */
@Injectable()
export class FFlowState<TNode = unknown, TConnection = unknown> {
  protected readonly config = inject(F_FLOW_STATE_CONFIG, { optional: true });

  /**
   * Resolves the node owning a connector; installed by the controller from
   * the live registries so node removal can cascade to attached connections.
   */
  public _connectorOwnerResolver: ((connectorId: string) => string | undefined) | null = null;

  private readonly _shape = signal<IFStateShape>({ nodes: {}, connections: {} });
  private readonly _undoStack: IFStateShape[] = [];
  private readonly _redoStack: IFStateShape[] = [];
  private readonly _canUndo = signal(false);
  private readonly _canRedo = signal(false);

  /** All nodes, re-emitted after every mutation, undo and redo. */
  public readonly nodes: Signal<IFStateNode<TNode>[]> = computed(
    () => Object.values(this._shape().nodes) as IFStateNode<TNode>[],
  );

  /** All connections, re-emitted after every mutation, undo and redo. */
  public readonly connections: Signal<IFStateConnection<TConnection>[]> = computed(
    () => Object.values(this._shape().connections) as IFStateConnection<TConnection>[],
  );

  public readonly canUndo: Signal<boolean> = this._canUndo.asReadonly();

  public readonly canRedo: Signal<boolean> = this._canRedo.asReadonly();

  // ------------------------------------------------------------------
  // Data in / data out
  // ------------------------------------------------------------------

  /** Replaces the whole graph and resets the undo history. */
  public load(data: Partial<IFStateData<TNode, TConnection>>): void {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this._shape.set({
      nodes: _byId((data.nodes ?? []) as IFStateNode[]),
      connections: _byId((data.connections ?? []) as IFStateConnection[]),
    });
    this._syncHistorySignals();
  }

  /**
   * The whole graph as plain arrays — safe to persist. Records and their
   * geometry are copied; the `data` payloads stay yours by reference.
   */
  public snapshot(): IFStateData<TNode, TConnection> {
    const { nodes, connections } = this._shape();

    return {
      nodes: Object.values(nodes).map((node) => ({
        ...node,
        position: { ...node.position },
        size: node.size ? { ...node.size } : undefined,
      })) as IFStateNode<TNode>[],
      connections: Object.values(connections).map((connection) => ({
        ...connection,
      })) as IFStateConnection<TConnection>[],
    };
  }

  public getNode(id: string): IFStateNode<TNode> | undefined {
    return this._shape().nodes[id] as IFStateNode<TNode> | undefined;
  }

  public getConnection(id: string): IFStateConnection<TConnection> | undefined {
    return this._shape().connections[id] as IFStateConnection<TConnection> | undefined;
  }

  // ------------------------------------------------------------------
  // Mutations — each call is ONE undoable history step
  // ------------------------------------------------------------------

  public addNodes(...nodes: IFStateNode<TNode>[]): void {
    if (!nodes.length) {
      return;
    }

    const shape = this.currentShape();
    this.commit({ ...shape, nodes: { ...shape.nodes, ..._byId(nodes as IFStateNode[]) } });
  }

  /** Shallow-merges the patch into the node: provided keys replace as a whole. */
  public updateNode(id: string, patch: Partial<Omit<IFStateNode<TNode>, 'id'>>): void {
    const shape = this.currentShape();
    const existing = shape.nodes[id];
    if (!existing) {
      return;
    }

    this.commit({
      ...shape,
      nodes: { ...shape.nodes, [id]: { ...existing, ...patch, id } as IFStateNode },
    });
  }

  /** Applies new positions to known nodes as ONE history step. */
  public moveNodes(positions: { id: string; position: IPoint }[]): void {
    const shape = this.currentShape();
    const known = positions.filter(({ id }) => shape.nodes[id]);
    if (!known.length) {
      return;
    }

    const nodes = { ...shape.nodes };
    for (const { id, position } of known) {
      nodes[id] = { ...nodes[id], position: { ...position } };
    }
    this.commit({ ...shape, nodes });
  }

  /**
   * Removes nodes and, when the connector-owner resolver is available (the
   * plugin is attached to a rendered flow), every connection attached to them
   * — all as ONE history step.
   */
  public removeNodes(ids: string[]): void {
    this.removeItems(ids, []);
  }

  public addConnections(...connections: IFStateConnection<TConnection>[]): void {
    if (!connections.length) {
      return;
    }

    const shape = this.currentShape();
    this.commit({
      ...shape,
      connections: { ...shape.connections, ..._byId(connections as IFStateConnection[]) },
    });
  }

  /** Shallow-merges the patch into the connection. */
  public updateConnection(
    id: string,
    patch: Partial<Omit<IFStateConnection<TConnection>, 'id'>>,
  ): void {
    const shape = this.currentShape();
    const existing = shape.connections[id];
    if (!existing) {
      return;
    }

    this.commit({
      ...shape,
      connections: {
        ...shape.connections,
        [id]: { ...existing, ...patch, id } as IFStateConnection,
      },
    });
  }

  public removeConnections(ids: string[]): void {
    this.removeItems([], ids);
  }

  /** Removes nodes (with connection cascade) and explicit connections as ONE history step. */
  public removeItems(nodeIds: string[], connectionIds: string[]): void {
    const shape = this.currentShape();
    const removedNodes = new Set(nodeIds.filter((id) => shape.nodes[id]));
    const removedConnections = new Set(connectionIds.filter((id) => shape.connections[id]));
    for (const id of this.cascadeConnectionIds([...removedNodes], shape)) {
      removedConnections.add(id);
    }

    if (!removedNodes.size && !removedConnections.size) {
      return;
    }

    this.commit({
      nodes: _without(shape.nodes, removedNodes),
      connections: _without(shape.connections, removedConnections),
    });
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
  }

  public redo(): void {
    const next = this._redoStack.pop();
    if (!next) {
      return;
    }

    this._undoStack.push(this._shape());
    this._shape.set(next);
    this._syncHistorySignals();
  }

  public clearHistory(): void {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this._syncHistorySignals();
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
      this.addConnections(connection as IFStateConnection<TConnection>);
    }
  }

  /** A reassign gesture finished. Default: update the moved endpoint. */
  public applyReassignConnection(event: FReassignConnectionEvent): void {
    if (event.endpoint === 'source' && event.nextSourceId) {
      this.updateConnection(event.connectionId, {
        sourceId: event.nextSourceId,
      } as Partial<IFStateConnection<TConnection>>);
    } else if (event.endpoint === 'target' && event.nextTargetId) {
      this.updateConnection(event.connectionId, {
        targetId: event.nextTargetId,
      } as Partial<IFStateConnection<TConnection>>);
    }
  }

  /** A node drag finished. Default: apply all positions as one step. */
  public applyMoveNodes(event: FMoveNodesEvent): void {
    this.moveNodes(event.nodes);
  }

  /** The user requested removal of the selection. Default: remove with cascade. */
  public applyDeleteSelected(event: FDeleteSelectedEvent): void {
    this.removeItems([...event.nodeIds, ...event.groupIds], event.connectionIds);
  }

  /** Nodes were dropped into a group. Default: reparent them as one step. */
  public applyDropToGroup(event: FDropToGroupEvent): void {
    const shape = this.currentShape();
    const known = event.nodeIds.filter((id) => shape.nodes[id]);
    if (!known.length) {
      return;
    }

    const nodes = { ...shape.nodes };
    for (const id of known) {
      nodes[id] = { ...nodes[id], parentId: event.targetGroupId };
    }
    this.commit({ ...shape, nodes });
  }

  /** An external item was dropped onto the canvas. Default: add a node for it. */
  public applyCreateNode(event: FCreateNodeEvent): void {
    const node = this.config?.nodeFactory
      ? this.config.nodeFactory(event)
      : this.createNodeRecord(event);
    if (node) {
      this.addNodes(node as IFStateNode<TNode>);
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

  /** Builds the record for an external-item drop. */
  protected createNodeRecord(event: FCreateNodeEvent): IFStateNode | null {
    return {
      id: generateGuid(),
      position: event.dropPosition ?? { x: event.externalItemRect.x, y: event.externalItemRect.y },
      parentId: event.targetContainerId ?? null,
      data: event.data,
    };
  }

  /** The current shape, for custom mutations in subclasses. */
  protected currentShape(): IFStateShape {
    return this._shape();
  }

  /**
   * Records the current shape into the history and applies the next one.
   * Route custom subclass mutations through here to make them undoable.
   */
  protected commit(next: IFStateShape): void {
    this._undoStack.push(this._shape());
    const limit = this.config?.historyLimit ?? 50;
    if (this._undoStack.length > limit) {
      this._undoStack.shift();
    }
    this._redoStack.length = 0;
    this._shape.set(next);
    this._syncHistorySignals();
  }

  /** Connections attached to the given nodes, per the connector-owner resolver. */
  protected cascadeConnectionIds(nodeIds: string[], shape: IFStateShape): string[] {
    const resolver = this._connectorOwnerResolver;
    if (!resolver || !nodeIds.length) {
      return [];
    }

    const removed = new Set(nodeIds);

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

/**
 * Typed accessor for the state store provided by `withFlowState()`.
 *
 * ```typescript
 * protected readonly state = injectFlowState<MyNodeData, MyEdgeData>();
 * ```
 */
export function injectFlowState<TNode = unknown, TConnection = unknown>(): FFlowState<
  TNode,
  TConnection
> {
  return inject(FFlowState) as FFlowState<TNode, TConnection>;
}
