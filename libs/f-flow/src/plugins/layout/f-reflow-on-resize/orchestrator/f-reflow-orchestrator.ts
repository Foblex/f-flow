import { inject, Injectable } from '@angular/core';
import { IRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import { FNodeBase } from '../../../../f-node';
import { GetNormalizedElementRectRequest } from '../../../../domain/get-normalized-element-rect';
import { FMoveNodesEvent } from '../../../../f-draggable';
import { FReflowController } from '../f-reflow-controller';
import { FReflowPlanner } from '../planner';
import { FReflowIgnoreRegistry } from '../directives/f-reflow-ignore-registry';
import { IReflowCandidate, IReflowConnection } from '../selection';
import { FReflowBaselineTracker } from '../f-reflow-baseline-tracker';

/**
 * Drives the resize → plan → apply pipeline.
 *
 * Invoked from two places:
 * - `UpdateNodeWhenStateOrSizeChanged` for content-driven resize (expand /
 *   collapse / programmatic `[fNodeSize]`). The caller does not provide a
 *   baseline — the tracker supplies one.
 * - `ResizeNodeHandler.onPointerUp` for user drag-resize, which provides
 *   the pre-drag baseline captured in `prepareDragSequence`.
 *
 * Shifts apply synchronously through `position.set` — no animator.
 * Per-node DOM writes are gated by `hostElement.isConnected` so a plan
 * that arrives during consumer-side teardown (e.g. parent reset) cannot
 * push stale view models through Angular CD.
 */
@Injectable()
export class FReflowOrchestrator {
  private readonly _controller = inject(FReflowController, { optional: true });
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _ignoreRegistry = inject(FReflowIgnoreRegistry);
  private readonly _planner = inject(FReflowPlanner);
  private readonly _tracker = inject(FReflowBaselineTracker);

  public handleResize(sourceNode: FNodeBase, baselineRect?: IRect): void {
    if (!this._controller?.isEnabled()) {
      return;
    }

    const sourceId = sourceNode.fId();
    const nextRect = this._safeGetRect(sourceNode);
    if (!nextRect) {
      return;
    }

    // A degenerate rect means the host is mid-unmount (e.g. consumer
    // replaced its `@for` source, the flow-node directive's view is being
    // torn down, ResizeObserver fires its final tick with width/height 0).
    // We must not plan against this state — the registry briefly still
    // holds the dying node, candidates would include other dying siblings,
    // and emitting `fMoveNodes` with their ids creates phantom entries in
    // consumer stores whose models have already moved on.
    if (!sourceNode.hostElement?.isConnected || nextRect.width === 0 || nextRect.height === 0) {
      this._tracker.delete(sourceId);

      return;
    }

    // Source baseline derivation:
    // - When the caller provides `baselineRect` (drag-resize path), trust
    //   it: it was captured at pointerdown and reflects the exact pre-drag
    //   geometry.
    // - Otherwise (content-driven path) the tracker's last `nextRect`
    //   carries the previous size, but its position can drift if the
    //   source moved between resizes — typical example: the parent group
    //   is dragged, which translates the child without firing a resize
    //   event. To avoid mixing the drag delta into the edge-deltas, we
    //   rebase the tracked baseline's position to the source's current
    //   DOM position. Size stays from the tracker (the canonical
    //   pre-resize size); position comes from the DOM (where the source
    //   actually sits at the moment of this resize).
    let baseline: IRect | undefined = baselineRect;
    if (!baseline) {
      const tracked = this._tracker.get(sourceId);
      if (tracked) {
        baseline = {
          x: nextRect.x,
          y: nextRect.y,
          width: tracked.width,
          height: tracked.height,
          gravityCenter: { x: nextRect.x + tracked.width / 2, y: nextRect.y + tracked.height / 2 },
        } as IRect;
      }
    }

    this._tracker.set(sourceId, nextRect);

    if (!baseline) {
      return;
    }

    const candidates = this._buildCandidates();
    const connections = this._buildConnections();
    const config = this._controller.getConfig();

    const plan = this._planner.plan({
      sourceId,
      baselineRect: baseline,
      nextRect,
      candidates,
      connections,
      config,
    });

    if (plan.shifts.length === 0) {
      return;
    }

    const moved: { id: string; position: { x: number; y: number } }[] = [];
    for (const shift of plan.shifts) {
      const node = this._store.nodes.get(shift.id);
      if (!node || !node.hostElement?.isConnected) {
        // Skip nodes the consumer has already unmounted; writing
        // `position.set` to a destroyed component pushes stale view
        // models through Angular CD and crashes downstream templates.
        continue;
      }

      const pos = { x: shift.toPosition.x, y: shift.toPosition.y };
      node.position.set(pos);
      this._tracker.set(shift.id, shift.toRect);
      moved.push({ id: shift.id, position: pos });
    }

    if (moved.length > 0) {
      this._store.fDraggable?.fMoveNodes.emit(new FMoveNodesEvent(moved));
    }
  }

  private _buildCandidates(): IReflowCandidate[] {
    const result: IReflowCandidate[] = [];
    for (const node of this._store.nodes.getAll()) {
      const id = node.fId();
      // DOM is the source of truth for candidate rects. Earlier versions
      // preferred a tracker-first read to dodge a within-frame race where
      // a freshly applied plan's `position.set` had not yet reached the
      // DOM transform — but that race made the tracker stale whenever a
      // candidate moved through any path other than reflow itself (drag
      // of the candidate, drag of an ancestor group, manual position
      // updates from the consumer model). Reading the DOM each time
      // costs a layout query but keeps candidates in sync with reality.
      const rect = this._safeGetRect(node);
      if (!rect) continue;
      result.push({
        id,
        rect,
        parentId: node.fParentId(),
        isIgnored: this._ignoreRegistry.has(id),
      });
    }

    return result;
  }

  /**
   * Resolves f-flow's connector-keyed connections down to node-to-node
   * links so graph-based selection strategies (DOWNSTREAM) can BFS
   * without walking the connector registry themselves.
   */
  private _buildConnections(): IReflowConnection[] {
    const connectorToNode = new Map<string, string>();
    for (const node of this._store.nodes.getAll()) {
      const nodeId = node.fId();
      for (const connector of node.connectors) {
        connectorToNode.set(connector.fId(), nodeId);
      }
    }

    const result: IReflowConnection[] = [];
    for (const conn of this._store.connections.getAll()) {
      const outputNodeId = connectorToNode.get(conn.fOutputId());
      const inputNodeId = connectorToNode.get(conn.fInputId());
      if (!outputNodeId || !inputNodeId) continue;
      result.push({ outputNodeId, inputNodeId });
    }

    return result;
  }

  private _safeGetRect(node: FNodeBase): IRect | null {
    if (!node.hostElement) {
      return null;
    }
    try {
      return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(node.hostElement));
    } catch {
      return null;
    }
  }
}
