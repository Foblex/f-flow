import {
  CalculateAdaptiveCurveData,
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';

describe('CalculateAdaptiveCurveData', () => {
  let builder: CalculateAdaptiveCurveData;

  const SAMPLES = 12;
  const ONE_SEG_POINTS = SAMPLES + 1; // 13

  beforeEach(() => {
    builder = new CalculateAdaptiveCurveData();
  });

  function expectFinitePoint(p: IPoint) {
    expect(p).toBeDefined();
    expect(Number.isFinite(p.x)).toBe(true);
    expect(Number.isFinite(p.y)).toBe(true);
  }

  function expectPointsArray(resp: IFConnectionBuilderResponse, expectedLen: number) {
    expect(resp.points).toBeDefined();
    expect(Array.isArray(resp.points)).toBe(true);
    expect(resp.points.length).toBe(expectedLen);

    for (let i = 0; i < resp.points.length; i++) {
      expectFinitePoint(resp.points[i]);
    }
  }

  function expectCubicPath(resp: IFConnectionBuilderResponse, start: { x: number; y: number }) {
    expect(resp.path).toBeDefined();
    expect(resp.path.startsWith(`M ${start.x} ${start.y}`)).toBe(true);
    expect(resp.path).toContain(' C ');
  }

  it('builds a cubic path for a horizontal connection (RIGHT -> LEFT)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      offset: 20,
      radius: 0,
      pivots: [],
    };

    const res = builder.handle(request);

    expectCubicPath(res, request.source);
    expectPointsArray(res, ONE_SEG_POINTS);

    expectFinitePoint(res.secondPoint);
    expectFinitePoint(res.penultimatePoint);

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(1);
    expect(res.candidates[0].chainIndex).toBe(0);
  });

  it('builds a cubic path for a vertical connection (BOTTOM -> TOP)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 100 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      offset: 20,
      radius: 0,
      pivots: [],
    };

    const res = builder.handle(request);

    expectCubicPath(res, request.source);
    expectPointsArray(res, ONE_SEG_POINTS);

    expectFinitePoint(res.secondPoint);
    expectFinitePoint(res.penultimatePoint);

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(1);
    expect(res.candidates[0].chainIndex).toBe(0);
  });

  it('builds a cubic path for a diagonal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      offset: 20,
      radius: 0,
      pivots: [],
    };

    const res = builder.handle(request);

    expectCubicPath(res, request.source);
    expectPointsArray(res, ONE_SEG_POINTS);

    expectFinitePoint(res.secondPoint);
    expectFinitePoint(res.penultimatePoint);

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(1);
    expect(res.candidates[0].chainIndex).toBe(0);
  });

  it('builds multi-segment cubic path when pivots exist', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      offset: 20,
      radius: 0,
      pivots: [{ x: 50, y: 50 }],
    };

    const res = builder.handle(request);

    expect(res.path).toBeDefined();
    expect(res.path.startsWith('M 0 0')).toBe(true);

    expect((res.path.match(/\sC\s/g) ?? []).length).toBe(2);

    expect(res.points).toBeDefined();
    expect(res.points.length).toBeGreaterThan(ONE_SEG_POINTS);

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(2);
    expect(res.candidates[0].chainIndex).toBe(0);
    expect(res.candidates[1].chainIndex).toBe(1);
  });

  it('ensures handles are not degenerate for typical input', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 10, y: 20 },
      target: { x: 110, y: 120 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      offset: 16,
      radius: 0,
      pivots: [],
    };

    const res = builder.handle(request);

    expectFinitePoint(res.secondPoint);
    expectFinitePoint(res.penultimatePoint);

    expect(
      !(res.secondPoint.x === request.source.x && res.secondPoint.y === request.source.y),
    ).toBe(true);
    expect(
      !(res.penultimatePoint.x === request.target.x && res.penultimatePoint.y === request.target.y),
    ).toBe(true);
  });
});
