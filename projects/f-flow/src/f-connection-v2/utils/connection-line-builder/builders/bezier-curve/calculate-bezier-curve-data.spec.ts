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
});
