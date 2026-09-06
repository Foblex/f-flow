import {
  CalculateBezierCurveData,
  createPureHarness,
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';

describe('CalculateBezierCurveData', () => {
  let builder: CalculateBezierCurveData;
  const pure = createPureHarness();

  beforeEach(() => {
    builder = new CalculateBezierCurveData();
  });

  it('builds cubic path for a simple horizontal connection (no pivots)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 20,
      waypoints: [],
    };

    const result: IFConnectionBuilderResponse = builder.handle(request);

    expect(result.path).toBe('M 0 0 C 100 0, 0 0, 100.0002 0.0002');

    expect(result.secondPoint).toEqual(pure.point(100, 0));
    expect(result.penultimatePoint).toEqual(pure.point(0, 0));

    expect(result.points).toBeDefined();
    expect(result.points.length).toBeGreaterThan(0);

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(1);
  });

  it('builds cubic path for a simple vertical connection (no pivots)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(0, 100),
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 20,
      waypoints: [],
    };

    const result = builder.handle(request);

    expect(result.path).toBe('M 0 0 C 0 100, 0 0, 0.0002 100.0002');

    expect(result.secondPoint).toEqual(pure.point(0, 100));
    expect(result.penultimatePoint).toEqual(pure.point(0, 0));

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(1);
  });

  it('builds multi-segment cubic path when pivots are present', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 20,
      waypoints: [pure.point(50, 50)],
    };

    const result = builder.handle(request);

    expect(result.path).toContain('M 0 0');
    expect((result.path.match(/\sC\s/g) ?? []).length).toBe(2);

    expect(result.points).toBeDefined();
    expect(result.points.length).toBeGreaterThan(0);

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(2);
  });

  it('handles diagonal connection and returns stable endpoints/control points', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 100),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 20,
      waypoints: [],
    };

    const result = builder.handle(request);

    expect(result.path).toContain('M 0 0');
    expect(result.path).toContain(' C ');

    expect(result.secondPoint).toBeDefined();
    expect(result.penultimatePoint).toBeDefined();

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(1);
  });

  it('passes through a waypoint without a tangent kink (issue #324)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(110, 60),
      target: pure.point(268, 250),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 12,
      waypoints: [pure.point(330, 30)],
    };

    const result = builder.handle(request);
    const segments = parseCubicSegments(result.path);

    expect(segments.length).toBe(2);

    const join = segments[0].p3;
    const incoming = Math.atan2(join.y - segments[0].c2.y, join.x - segments[0].c2.x);
    const outgoing = Math.atan2(segments[1].c1.y - join.y, segments[1].c1.x - join.x);

    expect(Math.abs(incoming - outgoing)).toBeLessThan(1e-9);
  });
});

interface IParsedCubicSegment {
  p0: { x: number; y: number };
  c1: { x: number; y: number };
  c2: { x: number; y: number };
  p3: { x: number; y: number };
}

function parseCubicSegments(path: string): IParsedCubicSegment[] {
  const start = /M ([-\d.]+) ([-\d.]+)/u.exec(path);
  const segments: IParsedCubicSegment[] = [];
  let current = { x: Number(start?.[1]), y: Number(start?.[2]) };

  const cubicPattern = /C ([-\d.]+) ([-\d.]+), ([-\d.]+) ([-\d.]+), ([-\d.]+) ([-\d.]+)/gu;
  let match: RegExpExecArray | null;
  while ((match = cubicPattern.exec(path)) !== null) {
    const [c1x, c1y, c2x, c2y, x, y] = match.slice(1).map(Number);
    segments.push({ p0: current, c1: { x: c1x, y: c1y }, c2: { x: c2x, y: c2y }, p3: { x, y } });
    current = { x, y };
  }

  return segments;
}
