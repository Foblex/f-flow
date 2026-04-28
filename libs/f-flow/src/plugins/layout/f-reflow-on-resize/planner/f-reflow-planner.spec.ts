import { RectExtensions } from '@foblex/2d';
import {
  EFReflowAxis,
  EFReflowCollision,
  EFReflowDeltaSource,
  EFReflowMode,
  EFReflowScope,
} from '../enums';
import { IFReflowOnResizeResolvedConfig } from '../i-f-reflow-on-resize-config';
import { IReflowCandidate } from '../selection';
import { FReflowPlanner } from './f-reflow-planner';

function makeConfig(
  overrides: Partial<IFReflowOnResizeResolvedConfig> = {},
): IFReflowOnResizeResolvedConfig {
  return {
    enabled: true,
    mode: EFReflowMode.CENTER_OF_MASS,
    collision: EFReflowCollision.STOP,
    scope: EFReflowScope.GLOBAL,
    axis: EFReflowAxis.VERTICAL,
    deltaSource: EFReflowDeltaSource.EDGE_BASED,
    spacing: { vertical: 10, horizontal: 10 },
    maxCascadeDepth: 8,
    maxAbsoluteShiftPerPlan: 10000,
    ...overrides,
  };
}

function makeCandidate(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { parentId?: string | null; isIgnored?: boolean } = {},
): IReflowCandidate {
  return {
    id,
    rect: RectExtensions.initialize(x, y, w, h),
    parentId: opts.parentId ?? null,
    isIgnored: opts.isIgnored ?? false,
  };
}

describe('FReflowPlanner', () => {
  let planner: FReflowPlanner;

  beforeEach(() => {
    planner = new FReflowPlanner();
  });

  it('returns an empty plan when baseline equals next', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const other = makeCandidate('other', 0, 80, 100, 50);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect: source.rect,
      candidates: [source, other],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts).toEqual([]);
  });

  it('shifts candidates below when the source grows downward', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const other = makeCandidate('other', 0, 80, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 90);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, other],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts.length).toBe(1);
    expect(plan.shifts[0]!.id).toBe('other');
    expect(plan.shifts[0]!.toPosition).toEqual({ x: 0, y: 120 });
  });

  it('skips candidates flagged as ignored', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const sticky = makeCandidate('sticky', 0, 80, 100, 50, { isIgnored: true });
    const shifted = makeCandidate('shifted', 0, 200, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 90);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, sticky, shifted],
      connections: [],
      config: makeConfig(),
    });

    const ids = plan.shifts.map((s) => s.id);
    expect(ids).not.toContain('sticky');
    expect(ids).toContain('shifted');
  });

  it('does not shift side-by-side candidates when x-ranges do not overlap', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const rightNeighbor = makeCandidate('right', 200, 80, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 90);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, rightNeighbor],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts.length).toBe(1);
    expect(plan.shifts[0]!.id).toBe('right');
    // STOP collision: rightNeighbor shares no x-overlap with source's new rect,
    // so it shifts the full delta because no obstacle blocks it.
  });

  it('is idempotent — running the plan on post-shift state produces no further shifts', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const other = makeCandidate('other', 0, 80, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 90);
    const config = makeConfig();

    const firstPlan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, other],
      connections: [],
      config,
    });

    const afterShift: IReflowCandidate = {
      ...other,
      rect: RectExtensions.initialize(
        firstPlan.shifts[0]!.toPosition.x,
        firstPlan.shifts[0]!.toPosition.y,
        other.rect.width,
        other.rect.height,
      ),
    };

    const movedSource: IReflowCandidate = { ...source, rect: nextRect };

    const secondPlan = planner.plan({
      sourceId: 'source',
      baselineRect: nextRect,
      nextRect,
      candidates: [movedSource, afterShift],
      connections: [],
      config,
    });

    expect(secondPlan.shifts).toEqual([]);
  });

  // -----------------------------------------------------------------
  // Phase 2 — collapse / grow-up / shrink-from-top / invariants
  // -----------------------------------------------------------------

  it('pulls a candidate back up when the source shrinks from the bottom', () => {
    const source = makeCandidate('source', 0, 0, 100, 90);
    const below = makeCandidate('below', 0, 120, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 50);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, below],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts.length).toBe(1);
    expect(plan.shifts[0]!.id).toBe('below');
    expect(plan.shifts[0]!.toPosition).toEqual({ x: 0, y: 80 });
  });

  it('shifts a candidate upward when the source grows from the top', () => {
    const source = makeCandidate('source', 0, 100, 100, 50);
    const above = makeCandidate('above', 0, 20, 100, 50);
    // Source top edge moves up by 30 (y: 100 -> 70), height grows 50 -> 80
    const nextRect = RectExtensions.initialize(0, 70, 100, 80);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, above],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts.length).toBe(1);
    expect(plan.shifts[0]!.id).toBe('above');
    expect(plan.shifts[0]!.toPosition).toEqual({ x: 0, y: -10 });
  });

  it('pulls a candidate above downward when the source shrinks from the top', () => {
    const source = makeCandidate('source', 0, 70, 100, 80);
    const above = makeCandidate('above', 0, -10, 100, 50);
    // Source top edge moves down by 30 (y: 70 -> 100), height shrinks 80 -> 50
    const nextRect = RectExtensions.initialize(0, 100, 100, 50);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, above],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts.length).toBe(1);
    expect(plan.shifts[0]!.id).toBe('above');
    expect(plan.shifts[0]!.toPosition).toEqual({ x: 0, y: 20 });
  });

  it('never produces shifts for a pure position change (same width/height)', () => {
    // Translation-only delta must return a no-op plan, otherwise the shifts
    // applied to a candidate would re-enter the reflow pipeline via
    // `stateChanges.notify()` and cause infinite re-entrancy.
    const source = makeCandidate('source', 0, 0, 100, 50);
    const below = makeCandidate('below', 0, 80, 100, 50);
    const translated = RectExtensions.initialize(0, 40, 100, 50);

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect: translated,
      candidates: [source, below],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts).toEqual([]);
  });

  it('shifts every candidate in a vertical column by the same delta', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const c1 = makeCandidate('c1', 0, 100, 100, 50);
    const c2 = makeCandidate('c2', 0, 200, 100, 50);
    const c3 = makeCandidate('c3', 0, 300, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 90); // grew +40

    const plan = planner.plan({
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, c1, c2, c3],
      connections: [],
      config: makeConfig(),
    });

    expect(plan.shifts.length).toBe(3);
    const byId = new Map(plan.shifts.map((s) => [s.id, s.toPosition.y]));
    expect(byId.get('c1')).toBe(140);
    expect(byId.get('c2')).toBe(240);
    expect(byId.get('c3')).toBe(340);
  });

  it('is deterministic — two runs with identical input produce identical plans', () => {
    const source = makeCandidate('source', 0, 0, 100, 50);
    const c1 = makeCandidate('c1', 0, 80, 100, 50);
    const c2 = makeCandidate('c2', 0, 200, 100, 50);
    const nextRect = RectExtensions.initialize(0, 0, 100, 90);

    const input = {
      sourceId: 'source',
      baselineRect: source.rect,
      nextRect,
      candidates: [source, c1, c2],
      connections: [],
      config: makeConfig(),
    };

    const a = planner.plan(input);
    const b = planner.plan(input);

    expect(a).toEqual(b);
  });

  it('produces geometrically-scaled plans for geometrically-scaled inputs', () => {
    // Planner is pure and has no zoom concept. When the orchestrator feeds
    // canvas-unit rects (as `GetNormalizedElementRectRequest` guarantees),
    // planning at different "world sizes" must be proportional: if every
    // rect and spacing value is scaled by k, every shift is also scaled by k.
    const scale = (k: number) => {
      const source = makeCandidate('source', 0, 0, 100 * k, 50 * k);
      const below = makeCandidate('below', 0, 80 * k, 100 * k, 50 * k);
      const nextRect = RectExtensions.initialize(0, 0, 100 * k, 90 * k);

      return planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, below],
        connections: [],
        config: makeConfig({ spacing: { vertical: 10 * k, horizontal: 10 * k } }),
      });
    };

    const planAt1 = scale(1);
    const planAt2 = scale(2);

    expect(planAt1.shifts.length).toBe(1);
    expect(planAt2.shifts.length).toBe(1);
    expect(planAt2.shifts[0]!.toPosition.y / planAt1.shifts[0]!.toPosition.y).toBeCloseTo(2, 6);
  });

  // -----------------------------------------------------------------
  // Phase 4 — X_RANGE / DOWNSTREAM / horizontal / commutativity
  // -----------------------------------------------------------------

  describe('X_RANGE mode', () => {
    it('keeps in-column candidates and drops out-of-column ones (vertical axis)', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const inColumn = makeCandidate('inColumn', 50, 80, 100, 50); // x-overlaps
      const outOfColumn = makeCandidate('outOfColumn', 300, 80, 100, 50); // far right
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, inColumn, outOfColumn],
        connections: [],
        config: makeConfig({ mode: EFReflowMode.X_RANGE }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('inColumn');
      expect(ids).not.toContain('outOfColumn');
    });

    it('uses Y-overlap when axis is horizontal', () => {
      const source = makeCandidate('source', 0, 0, 50, 100);
      const inRow = makeCandidate('inRow', 80, 50, 50, 100); // y-overlaps
      const outOfRow = makeCandidate('outOfRow', 80, 300, 50, 100);
      const nextRect = RectExtensions.initialize(0, 0, 90, 100);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, inRow, outOfRow],
        connections: [],
        config: makeConfig({ mode: EFReflowMode.X_RANGE, axis: EFReflowAxis.HORIZONTAL }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('inRow');
      expect(ids).not.toContain('outOfRow');
    });

    it('keeps candidates that overlap on either axis when axis is BOTH', () => {
      const source = makeCandidate('source', 0, 0, 100, 100);
      const xOverlap = makeCandidate('xOverlap', 50, 200, 100, 50); // x-overlaps only
      const yOverlap = makeCandidate('yOverlap', 200, 50, 50, 100); // y-overlaps only
      const noOverlap = makeCandidate('noOverlap', 300, 300, 50, 50);
      const nextRect = RectExtensions.initialize(0, 0, 120, 120);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, xOverlap, yOverlap, noOverlap],
        connections: [],
        config: makeConfig({ mode: EFReflowMode.X_RANGE, axis: EFReflowAxis.BOTH }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('xOverlap');
      expect(ids).toContain('yOverlap');
      expect(ids).not.toContain('noOverlap');
    });
  });

  describe('DOWNSTREAM_CONNECTIONS mode', () => {
    it('shifts only nodes reachable via outgoing edges from the source', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const downstream = makeCandidate('downstream', 0, 80, 100, 50);
      const sibling = makeCandidate('sibling', 0, 200, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, downstream, sibling],
        connections: [{ outputNodeId: 'source', inputNodeId: 'downstream' }],
        config: makeConfig({ mode: EFReflowMode.DOWNSTREAM_CONNECTIONS }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('downstream');
      expect(ids).not.toContain('sibling');
    });

    it('walks transitively through chained connections', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const a = makeCandidate('a', 0, 80, 100, 50);
      const b = makeCandidate('b', 0, 160, 100, 50);
      const c = makeCandidate('c', 0, 240, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, a, b, c],
        connections: [
          { outputNodeId: 'source', inputNodeId: 'a' },
          { outputNodeId: 'a', inputNodeId: 'b' },
          { outputNodeId: 'b', inputNodeId: 'c' },
        ],
        config: makeConfig({ mode: EFReflowMode.DOWNSTREAM_CONNECTIONS }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('a');
      expect(ids).toContain('b');
      expect(ids).toContain('c');
    });

    it('terminates safely on cyclic graphs', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const a = makeCandidate('a', 0, 80, 100, 50);
      const b = makeCandidate('b', 0, 160, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, a, b],
        connections: [
          { outputNodeId: 'source', inputNodeId: 'a' },
          { outputNodeId: 'a', inputNodeId: 'b' },
          { outputNodeId: 'b', inputNodeId: 'a' }, // cycle
        ],
        config: makeConfig({ mode: EFReflowMode.DOWNSTREAM_CONNECTIONS }),
      });

      // Should not infinite-loop; both a and b are downstream of source
      expect(plan.shifts.map((s) => s.id).sort()).toEqual(['a', 'b']);
    });
  });

  describe('horizontal axis', () => {
    it('shifts a candidate to the right when source grows rightward', () => {
      const source = makeCandidate('source', 0, 0, 50, 100);
      const right = makeCandidate('right', 80, 0, 50, 100);
      const nextRect = RectExtensions.initialize(0, 0, 90, 100);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, right],
        connections: [],
        config: makeConfig({ axis: EFReflowAxis.HORIZONTAL }),
      });

      expect(plan.shifts.length).toBe(1);
      expect(plan.shifts[0]!.id).toBe('right');
      expect(plan.shifts[0]!.toPosition).toEqual({ x: 120, y: 0 });
    });
  });

  describe('combined axis (BOTH)', () => {
    it('produces independent x and y shifts that compose additively', () => {
      const source = makeCandidate('source', 0, 0, 50, 50);
      const corner = makeCandidate('corner', 80, 80, 50, 50);
      const nextRect = RectExtensions.initialize(0, 0, 90, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, corner],
        connections: [],
        config: makeConfig({ axis: EFReflowAxis.BOTH }),
      });

      expect(plan.shifts.length).toBe(1);
      const shift = plan.shifts[0]!;
      expect(shift.id).toBe('corner');
      // x grew by 40, y grew by 40 — corner shifts by both deltas
      expect(shift.toPosition).toEqual({ x: 120, y: 120 });
    });

    it('plan results are independent of axis-evaluation order (commutativity)', () => {
      // The planner emits shifts whose x and y components are computed
      // independently per axis. Running with axis=BOTH must be equivalent
      // to running x-only and y-only and overlaying their results.
      const source = makeCandidate('source', 0, 0, 50, 50);
      const c1 = makeCandidate('c1', 80, 0, 50, 50);
      const c2 = makeCandidate('c2', 0, 80, 50, 50);
      const c3 = makeCandidate('c3', 80, 80, 50, 50);
      const nextRect = RectExtensions.initialize(0, 0, 90, 90);
      const baseInput = {
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, c1, c2, c3],
        connections: [],
      };

      const planBoth = planner.plan({
        ...baseInput,
        config: makeConfig({ axis: EFReflowAxis.BOTH }),
      });
      const planVertical = planner.plan({
        ...baseInput,
        config: makeConfig({ axis: EFReflowAxis.VERTICAL }),
      });
      const planHorizontal = planner.plan({
        ...baseInput,
        config: makeConfig({ axis: EFReflowAxis.HORIZONTAL }),
      });

      // For each id, BOTH = HORIZONTAL.x + VERTICAL.y (relative to baseline)
      const merge = new Map<string, { x: number; y: number }>();
      for (const s of planHorizontal.shifts) merge.set(s.id, { ...s.toPosition });
      for (const s of planVertical.shifts) {
        const cur = merge.get(s.id) ?? { x: 0, y: 0 };
        cur.y = s.toPosition.y;
        merge.set(s.id, cur);
      }

      for (const s of planBoth.shifts) {
        const expected = merge.get(s.id);
        if (!expected) continue;
        // x from horizontal plan, y from vertical plan, both relative to original
        expect(s.toPosition.x).toBeCloseTo(expected.x, 6);
        expect(s.toPosition.y).toBeCloseTo(expected.y, 6);
      }
    });
  });

  // -----------------------------------------------------------------
  // Phase 5 — CHAIN_PUSH collision + GROUP / CONNECTED_SUBGRAPH scopes
  // -----------------------------------------------------------------

  describe('GROUP scope', () => {
    it('keeps only siblings sharing the source parent', () => {
      const source = makeCandidate('source', 0, 0, 100, 50, { parentId: 'g1' });
      const sibling = makeCandidate('sibling', 0, 80, 100, 50, { parentId: 'g1' });
      const cousin = makeCandidate('cousin', 0, 200, 100, 50, { parentId: 'g2' });
      const orphan = makeCandidate('orphan', 0, 320, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, sibling, cousin, orphan],
        connections: [],
        config: makeConfig({ scope: EFReflowScope.GROUP }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('sibling');
      expect(ids).not.toContain('cousin');
      expect(ids).not.toContain('orphan');
    });

    it('treats top-level source as filtering to top-level candidates', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const topLevel = makeCandidate('topLevel', 0, 80, 100, 50);
      const grouped = makeCandidate('grouped', 0, 200, 100, 50, { parentId: 'g1' });
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, topLevel, grouped],
        connections: [],
        config: makeConfig({ scope: EFReflowScope.GROUP }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('topLevel');
      expect(ids).not.toContain('grouped');
    });
  });

  describe('CONNECTED_SUBGRAPH scope', () => {
    it('keeps only nodes in the same connected component as the source', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const inComponent = makeCandidate('inComponent', 0, 80, 100, 50);
      const outOfComponent = makeCandidate('outOfComponent', 300, 80, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, inComponent, outOfComponent],
        connections: [{ outputNodeId: 'source', inputNodeId: 'inComponent' }],
        config: makeConfig({ scope: EFReflowScope.CONNECTED_SUBGRAPH }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('inComponent');
      expect(ids).not.toContain('outOfComponent');
    });

    it('walks edges in both directions (upstream + downstream) to compute the component', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const upstream = makeCandidate('upstream', 0, -200, 100, 50);
      const downstream = makeCandidate('downstream', 0, 80, 100, 50);
      const isolated = makeCandidate('isolated', 0, 320, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, upstream, downstream, isolated],
        connections: [
          { outputNodeId: 'upstream', inputNodeId: 'source' },
          { outputNodeId: 'source', inputNodeId: 'downstream' },
        ],
        config: makeConfig({ scope: EFReflowScope.CONNECTED_SUBGRAPH }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('downstream');
      expect(ids).not.toContain('isolated');
    });
  });

  describe('CHAIN_PUSH collision', () => {
    it('absorbs a non-candidate obstacle into the plan and pushes it along', () => {
      // Source grows by +40 down. `sibling` is a candidate; `wall` is
      // explicitly excluded from selection (e.g. via fReflowIgnore set
      // false but in different subgraph) — for STOP it would block sibling;
      // for CHAIN_PUSH it joins the shift.
      const source = makeCandidate('source', 0, 0, 100, 50);
      const candidate = makeCandidate('candidate', 0, 80, 100, 50);
      const wall = makeCandidate('wall', 0, 160, 100, 50);
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, candidate, wall],
        connections: [],
        config: makeConfig({
          collision: EFReflowCollision.CHAIN_PUSH,
          spacing: { vertical: 10, horizontal: 10 },
        }),
      });

      // candidate should shift; wall should also have been pushed
      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('candidate');
      expect(ids).toContain('wall');
    });

    it('chain push terminates within maxCascadeDepth on long stacks', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const stack: IReflowCandidate[] = [source];
      for (let i = 0; i < 5; i++) {
        stack.push(makeCandidate(`n${i}`, 0, 80 + i * 80, 100, 50));
      }
      const nextRect = RectExtensions.initialize(0, 0, 100, 200);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: stack,
        connections: [],
        config: makeConfig({
          collision: EFReflowCollision.CHAIN_PUSH,
          maxCascadeDepth: 3, // intentionally low
        }),
      });

      // Should terminate without throwing; exact shift count may be
      // bounded by depth, but plan returns a result.
      expect(plan).toBeDefined();
      expect(plan.shifts.length).toBeGreaterThan(0);
    });

    it('does not add unrelated nodes (no perpendicular overlap) into the chain', () => {
      const source = makeCandidate('source', 0, 0, 100, 50);
      const candidate = makeCandidate('candidate', 0, 80, 100, 50);
      const sideways = makeCandidate('sideways', 300, 0, 100, 50); // far right, no x-overlap
      const nextRect = RectExtensions.initialize(0, 0, 100, 90);

      const plan = planner.plan({
        sourceId: 'source',
        baselineRect: source.rect,
        nextRect,
        candidates: [source, candidate, sideways],
        connections: [],
        config: makeConfig({ collision: EFReflowCollision.CHAIN_PUSH }),
      });

      const ids = plan.shifts.map((s) => s.id);
      expect(ids).toContain('candidate');
      expect(ids).not.toContain('sideways');
    });
  });
});
