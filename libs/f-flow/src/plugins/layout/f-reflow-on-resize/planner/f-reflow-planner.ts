import { IRect } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { EFReflowCollision, EFReflowDeltaSource, EFReflowMode, EFReflowScope } from '../enums';
import {
  CenterBasedDeltaCalculator,
  EdgeBasedDeltaCalculator,
  IFReflowDeltaCalculator,
  computeEdgeDeltas,
} from '../delta';
import {
  IReflowCandidate,
  IReflowConnection,
  IFReflowSelectionStrategy,
  CenterOfMassSelectionStrategy,
  XRangeSelectionStrategy,
  DownstreamConnectionsSelectionStrategy,
} from '../selection';
import {
  ConnectedSubgraphScopeFilter,
  GlobalScopeFilter,
  GroupScopeFilter,
  IFReflowScopeFilter,
} from '../scope';
import {
  ChainPushCollisionResolver,
  IFReflowCollisionResolver,
  IReflowRawShift,
  StopCollisionResolver,
} from '../collision';
import { IReflowPlan, EMPTY_REFLOW_PLAN } from '../i-reflow-plan';
import { IFReflowOnResizeResolvedConfig } from '../i-f-reflow-on-resize-config';

export interface IReflowPlannerInput {
  sourceId: string;
  baselineRect: IRect;
  nextRect: IRect;
  candidates: IReflowCandidate[];
  connections: IReflowConnection[];
  config: IFReflowOnResizeResolvedConfig;
}

/**
 * Pure planner: no DI, no side effects. Consumes rect data + config and
 * produces a plan the orchestrator/animator can apply.
 *
 * Phase 1 coverage: `CENTER_OF_MASS` selection, `GLOBAL` scope, `STOP`
 * collision. Unsupported modes fall back to no-op until subsequent phases
 * add their strategies.
 */
@Injectable()
export class FReflowPlanner {
  private readonly _edgeBased = new EdgeBasedDeltaCalculator();
  private readonly _centerBased = new CenterBasedDeltaCalculator();
  private readonly _centerOfMassSelection = new CenterOfMassSelectionStrategy();
  private readonly _xRangeSelection = new XRangeSelectionStrategy();
  private readonly _globalScope = new GlobalScopeFilter();
  private readonly _groupScope = new GroupScopeFilter();
  private readonly _connectedSubgraphScope = new ConnectedSubgraphScopeFilter();
  private readonly _stopCollision = new StopCollisionResolver();

  public plan(input: IReflowPlannerInput): IReflowPlan {
    const { sourceId, baselineRect, nextRect, candidates, connections, config } = input;

    if (this._isNoOpDelta(baselineRect, nextRect)) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }

    const selection = this._resolveSelection(config.mode, config);
    if (!selection) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }

    const scopeFilter = this._resolveScope(config.scope);
    if (!scopeFilter) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }

    const collisionResolver = this._resolveCollision(config.collision, config);
    if (!collisionResolver) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }

    const deltaCalculator = this._resolveDeltaCalculator(config.deltaSource);

    // The parent chain and the descendant subtree of the source must never
    // be shifted. Ancestors own the source's coordinate frame — pushing the
    // parent while the child stays would visually slide the frame out from
    // under it. Descendants are anchored inside the source — a parent's
    // own auto-fit response could otherwise re-enter the plan and explode
    // positions in a feedback loop.
    //
    // Cross-level shifts beyond that are allowed: `scope` is the
    // user-facing knob for "how far does this resize reach". GLOBAL really
    // does mean global, including across nesting levels.
    const eligible = this._excludeSourceAncestorsAndDescendants(candidates, sourceId);

    const preselected = selection.select({
      sourceId,
      sourceBaselineRect: baselineRect,
      sourceNextRect: nextRect,
      candidates: eligible,
      connections,
      axis: config.axis,
    });

    const sourceCandidate = candidates.find((c) => c.id === sourceId) ?? null;
    const scoped = scopeFilter.filter({
      sourceCandidate,
      candidates: preselected,
      connections,
    });

    const rawShifts = this._computeRawShifts(
      deltaCalculator,
      scoped,
      baselineRect,
      nextRect,
      config,
    );

    // Containment: a candidate must not be shifted outside its parent
    // group's rect. The parent's outer bounds act as walls — the shift
    // is clamped at the wall minus spacing. Without this step, neighbours
    // inside a fixed-size group leak through the group's borders the
    // moment the source grows past what the group can accommodate.
    const containedShifts = this._clampToParentBounds(rawShifts, candidates);

    if (containedShifts.length === 0) {
      return {
        sourceNodeId: sourceId,
        shifts: [],
        deltaEdges: computeEdgeDeltas(baselineRect, nextRect),
      };
    }

    const resolved = collisionResolver.resolve({
      sourceNextRect: nextRect,
      rawShifts: containedShifts,
      // Collision pool follows the user's scope. Out-of-scope nodes are
      // off-limits to the plan — they must not become stationary
      // obstacles a shift slams into (STOP) and must not be absorbed
      // into the cascade (CHAIN_PUSH). With the pool restricted to
      // `scoped`, the chosen scope semantically owns both who moves and
      // what counts as solid.
      //
      // Anchored nodes (`fReflowIgnore`) stay in the pool: they never
      // get a primary shift (filtered out in `_computeRawShifts`), but
      // they must still register as obstacles so STOP clamps against
      // them and CHAIN_PUSH treats them as something to push past.
      pool: scoped,
      spacing: config.spacing,
      maxAbsoluteShift: config.maxAbsoluteShiftPerPlan,
    });

    return {
      sourceNodeId: sourceId,
      shifts: resolved.map((r) => ({
        id: r.candidate.id,
        fromRect: r.fromRect,
        toRect: r.toRect,
        toPosition: r.toPosition,
      })),
      deltaEdges: computeEdgeDeltas(baselineRect, nextRect),
    };
  }

  /**
   * Clamps each candidate's shift so the post-shift rect cannot extend
   * past its parent's outer bounds. The parent's edges act as walls —
   * a shift that would carry a sibling outside the group is reduced to
   * land flush against the inside edge.
   *
   * Top-level candidates (no parent) pass through unchanged. Spacing is
   * intentionally not applied here: that is a between-nodes concern and
   * is handled by the collision resolver against fellow shifts. Adding
   * spacing here would also fight any candidate whose original position
   * is already on or past the parent's edge.
   */
  private _clampToParentBounds(
    shifts: IReflowRawShift[],
    candidates: IReflowCandidate[],
  ): IReflowRawShift[] {
    const byId = new Map(candidates.map((c) => [c.id, c]));
    const result: IReflowRawShift[] = [];

    for (const raw of shifts) {
      const cand = raw.candidate;
      const parent = cand.parentId ? byId.get(cand.parentId) : null;
      if (!parent) {
        result.push(raw);
        continue;
      }

      const minX = parent.rect.x;
      const maxX = parent.rect.x + parent.rect.width - cand.rect.width;
      const minY = parent.rect.y;
      const maxY = parent.rect.y + parent.rect.height - cand.rect.height;

      const targetX = cand.rect.x + raw.shift.x;
      const targetY = cand.rect.y + raw.shift.y;

      const clampedX = Math.max(minX, Math.min(maxX, targetX));
      const clampedY = Math.max(minY, Math.min(maxY, targetY));

      const dx = clampedX - cand.rect.x;
      const dy = clampedY - cand.rect.y;

      if (dx === 0 && dy === 0) continue;

      result.push({ candidate: cand, shift: { x: dx, y: dy } });
    }

    return result;
  }

  /**
   * Returns candidates with the source itself, the source's full parent
   * chain, and the source's descendant subtree all removed. Cycle-safe
   * via visited sets so malformed parent links cannot loop forever.
   */
  private _excludeSourceAncestorsAndDescendants(
    candidates: IReflowCandidate[],
    sourceId: string,
  ): IReflowCandidate[] {
    const byId = new Map<string, IReflowCandidate>();
    const childrenOf = new Map<string, string[]>();
    for (const c of candidates) {
      byId.set(c.id, c);
      const pid = c.parentId ?? null;
      if (pid) {
        const list = childrenOf.get(pid) ?? [];
        list.push(c.id);
        childrenOf.set(pid, list);
      }
    }

    const blocked = new Set<string>([sourceId]);

    let cursor = byId.get(sourceId)?.parentId ?? null;
    const visitedAncestors = new Set<string>();
    while (cursor && !visitedAncestors.has(cursor)) {
      visitedAncestors.add(cursor);
      blocked.add(cursor);
      cursor = byId.get(cursor)?.parentId ?? null;
    }

    const queue: string[] = [...(childrenOf.get(sourceId) ?? [])];
    const visitedDescendants = new Set<string>();
    while (queue.length > 0) {
      const id = queue.shift() as string;
      if (visitedDescendants.has(id)) continue;
      visitedDescendants.add(id);
      blocked.add(id);
      for (const child of childrenOf.get(id) ?? []) {
        queue.push(child);
      }
    }

    return candidates.filter((c) => !blocked.has(c.id));
  }

  /**
   * Reflow reacts to SIZE changes only. A pure translation (position
   * changed, size unchanged) must not generate shifts — doing so would
   * cascade through every candidate that was just shifted, since each
   * shift re-enters this path via `stateChanges.notify()` in
   * `FNodeDirective.refresh()`.
   */
  private _isNoOpDelta(baseline: IRect, next: IRect): boolean {
    return baseline.width === next.width && baseline.height === next.height;
  }

  private _resolveSelection(
    mode: EFReflowMode,
    config: IFReflowOnResizeResolvedConfig,
  ): IFReflowSelectionStrategy | null {
    switch (mode) {
      case EFReflowMode.CENTER_OF_MASS:
        return this._centerOfMassSelection;
      case EFReflowMode.X_RANGE:
        return this._xRangeSelection;
      case EFReflowMode.DOWNSTREAM_CONNECTIONS:
        return new DownstreamConnectionsSelectionStrategy(config.maxCascadeDepth);
      default:
        return null;
    }
  }

  private _resolveScope(scope: EFReflowScope): IFReflowScopeFilter | null {
    switch (scope) {
      case EFReflowScope.GLOBAL:
        return this._globalScope;
      case EFReflowScope.GROUP:
        return this._groupScope;
      case EFReflowScope.CONNECTED_SUBGRAPH:
        return this._connectedSubgraphScope;
      default:
        return null;
    }
  }

  private _resolveCollision(
    collision: EFReflowCollision,
    config: IFReflowOnResizeResolvedConfig,
  ): IFReflowCollisionResolver | null {
    switch (collision) {
      case EFReflowCollision.STOP:
        return this._stopCollision;
      case EFReflowCollision.CHAIN_PUSH:
        return new ChainPushCollisionResolver(config.maxCascadeDepth);
      default:
        return null;
    }
  }

  private _resolveDeltaCalculator(source: EFReflowDeltaSource): IFReflowDeltaCalculator {
    return source === EFReflowDeltaSource.CENTER_BASED ? this._centerBased : this._edgeBased;
  }

  private _computeRawShifts(
    calculator: IFReflowDeltaCalculator,
    candidates: IReflowCandidate[],
    baselineRect: IRect,
    nextRect: IRect,
    config: IFReflowOnResizeResolvedConfig,
  ): IReflowRawShift[] {
    const shifts: IReflowRawShift[] = [];
    for (const candidate of candidates) {
      // Anchored nodes (`fReflowIgnore`) never receive a primary shift —
      // they stay where they are. They remain in the collision pool so
      // STOP can clamp other shifts against them and CHAIN_PUSH treats
      // them as obstacles to absorb.
      if (candidate.isIgnored) continue;

      const shift = calculator.calculate({
        baselineRect,
        nextRect,
        candidateRect: candidate.rect,
        axis: config.axis,
      });
      if (shift !== null) {
        shifts.push({ candidate, shift });
      }
    }

    return shifts;
  }
}
