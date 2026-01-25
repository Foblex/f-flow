import {
  CalculateBezierCurveData,
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';

describe('CalculateBezierCurveData', () => {
  let builder: CalculateBezierCurveData;

  beforeEach(() => {
    builder = new CalculateBezierCurveData();
  });

  it('builds cubic path for a simple horizontal connection (no pivots)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 20,
      waypoints: [],
    };

    const res: IFConnectionBuilderResponse = builder.handle(request);

    expect(res.path).toBe('M 0 0 C 100 0, 0 0, 100.0002 0.0002');

    expect(res.secondPoint).toEqual({ x: 100, y: 0 });
    expect(res.penultimatePoint).toEqual({ x: 0, y: 0 });

    expect(res.points).toBeDefined();
    expect(res.points.length).toBeGreaterThan(0);

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(1);
  });

  it('builds cubic path for a simple vertical connection (no pivots)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 100 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 20,
      waypoints: [],
    };

    const res = builder.handle(request);

    expect(res.path).toBe('M 0 0 C 0 100, 0 0, 0.0002 100.0002');

    expect(res.secondPoint).toEqual({ x: 0, y: 100 });
    expect(res.penultimatePoint).toEqual({ x: 0, y: 0 });

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(1);
  });

  it('builds multi-segment cubic path when pivots are present', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 20,
      waypoints: [
        { x: 50, y: 50 }, // pivot 1
      ],
    };

    const res = builder.handle(request);

    expect(res.path).toContain('M 0 0');

    expect((res.path.match(/\sC\s/g) ?? []).length).toBe(2);

    expect(res.points).toBeDefined();
    expect(res.points.length).toBeGreaterThan(0);

    // candidates: typically 1 per segment
    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(2);
  });

  it('handles diagonal connection and returns stable endpoints/control points', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 20,
      waypoints: [],
    };

    const res = builder.handle(request);

    expect(res.path).toContain('M 0 0');
    expect(res.path).toContain(' C ');

    expect(res.secondPoint).toBeDefined();
    expect(res.penultimatePoint).toBeDefined();

    expect(res.candidates).toBeDefined();
    expect(res.candidates.length).toBe(1);
  });
});
