import { IPoint } from '@foblex/2d';
import {
  CalculateAdaptiveCurveData,
  createPureHarness,
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';

describe('CalculateAdaptiveCurveData', () => {
  let builder: CalculateAdaptiveCurveData;

  const pure = createPureHarness();
  const SAMPLES = 12;
  const ONE_SEG_POINTS = SAMPLES + 1;

  beforeEach(() => {
    builder = new CalculateAdaptiveCurveData();
  });

  function expectFinitePoint(p: IPoint): void {
    expect(p).toBeDefined();
    expect(Number.isFinite(p.x)).toBe(true);
    expect(Number.isFinite(p.y)).toBe(true);
  }

  function expectPointsArray(resp: IFConnectionBuilderResponse, expectedLen: number): void {
    expect(resp.points).toBeDefined();
    expect(Array.isArray(resp.points)).toBe(true);
    expect(resp.points.length).toBe(expectedLen);

    for (let i = 0; i < resp.points.length; i++) {
      expectFinitePoint(resp.points[i]);
    }
  }

  function expectCubicPath(
    resp: IFConnectionBuilderResponse,
    start: { x: number; y: number },
  ): void {
    expect(resp.path).toBeDefined();
    expect(resp.path.startsWith(`M ${start.x} ${start.y}`)).toBe(true);
    expect(resp.path).toContain(' C ');
  }

  it('builds a cubic path for a horizontal connection (RIGHT -> LEFT)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      offset: 20,
      radius: 0,
      waypoints: [],
    };

    const result = builder.handle(request);

    expectCubicPath(result, request.source);
    expectPointsArray(result, ONE_SEG_POINTS);

    expectFinitePoint(result.secondPoint);
    expectFinitePoint(result.penultimatePoint);

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(1);
  });

  it('builds a cubic path for a vertical connection (BOTTOM -> TOP)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(0, 100),
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      offset: 20,
      radius: 0,
      waypoints: [],
    };

    const result = builder.handle(request);

    expectCubicPath(result, request.source);
    expectPointsArray(result, ONE_SEG_POINTS);

    expectFinitePoint(result.secondPoint);
    expectFinitePoint(result.penultimatePoint);

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(1);
  });

  it('builds a cubic path for a diagonal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 100),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      offset: 20,
      radius: 0,
      waypoints: [],
    };

    const result = builder.handle(request);

    expectCubicPath(result, request.source);
    expectPointsArray(result, ONE_SEG_POINTS);

    expectFinitePoint(result.secondPoint);
    expectFinitePoint(result.penultimatePoint);

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(1);
  });

  it('builds multi-segment cubic path when pivots exist', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      offset: 20,
      radius: 0,
      waypoints: [pure.point(50, 50)],
    };

    const result = builder.handle(request);

    expect(result.path).toBeDefined();
    expect(result.path.startsWith('M 0 0')).toBe(true);

    expect((result.path.match(/\sC\s/g) ?? []).length).toBe(2);

    expect(result.points).toBeDefined();
    expect(result.points.length).toBeGreaterThan(ONE_SEG_POINTS);

    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBe(2);
  });

  it('ensures handles are not degenerate for typical input', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(10, 20),
      target: pure.point(110, 120),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      offset: 16,
      radius: 0,
      waypoints: [],
    };

    const result = builder.handle(request);

    expectFinitePoint(result.secondPoint);
    expectFinitePoint(result.penultimatePoint);

    expect(
      !(result.secondPoint.x === request.source.x && result.secondPoint.y === request.source.y),
    ).toBe(true);
    expect(
      !(
        result.penultimatePoint.x === request.target.x &&
        result.penultimatePoint.y === request.target.y
      ),
    ).toBe(true);
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
    const segments = parseAdaptiveCubicSegments(result.path);

    expect(segments.length).toBe(2);

    const join = segments[0].p3;
    const incoming = Math.atan2(join.y - segments[0].c2.y, join.x - segments[0].c2.x);
    const outgoing = Math.atan2(segments[1].c1.y - join.y, segments[1].c1.x - join.x);

    expect(Math.abs(incoming - outgoing)).toBeLessThan(1e-9);
  });
});

interface IParsedAdaptiveSegment {
  p0: IPoint;
  c1: IPoint;
  c2: IPoint;
  p3: IPoint;
}

function parseAdaptiveCubicSegments(path: string): IParsedAdaptiveSegment[] {
  const start = /M ([-\d.]+) ([-\d.]+)/u.exec(path);
  const segments: IParsedAdaptiveSegment[] = [];
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
