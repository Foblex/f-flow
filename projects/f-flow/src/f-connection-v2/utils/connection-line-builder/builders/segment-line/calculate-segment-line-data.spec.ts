import { CalculateSegmentLineData, createPureHarness, EFConnectableSide } from '@foblex/flow';
import { IFConnectionBuilderRequest, IFConnectionBuilderResponse } from '../../models';

describe('CalculateSegmentLineData', () => {
  let builder: CalculateSegmentLineData;
  const pure = createPureHarness();

  beforeEach(() => {
    builder = new CalculateSegmentLineData();
  });

  function expectCommon(response: IFConnectionBuilderResponse): void {
    expect(response.path).toBeTruthy();
    expect(response.points).toBeTruthy();
    expect(Array.isArray(response.points)).toBe(true);
    expect(response.points.length).toBeGreaterThanOrEqual(2);

    const points = response.points;
    expect(response.secondPoint).toEqual(points[1]);
    expect(response.penultimatePoint).toEqual(points[points.length - 2]);
  }

  it('builds a path for a horizontal connection (RIGHT -> LEFT)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 20,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);

    expect(response.points[0]).toEqual(request.source);
    expect(response.points[response.points.length - 1]).toEqual(request.target);
    expect(response.candidates?.length ?? 0).toBeGreaterThan(0);
  });

  it('builds a path for a vertical connection (BOTTOM -> TOP)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(0, 100),
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 10,
      offset: 20,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);

    expect(response.points[0]).toEqual(request.source);
    expect(response.points[response.points.length - 1]).toEqual(request.target);
    expect(response.candidates?.length ?? 0).toBeGreaterThan(0);
  });

  it('builds a path for a diagonal connection (RIGHT -> BOTTOM)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 100),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 10,
      offset: 20,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);
    expect(response.points.length).toBeGreaterThanOrEqual(2);
    expect(response.candidates?.length ?? 0).toBeGreaterThan(0);
  });

  it('respects offset by introducing gaps near ports', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(50, 50),
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 30,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);

    const firstInnerPoint = response.points[1];
    expect(firstInnerPoint.x !== request.source.x || firstInnerPoint.y !== request.source.y).toBe(
      true,
    );
  });

  it('produces quadratic bends (Q) when radius > 0 and there is at least one corner', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 100),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 20,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);

    const hasQuadraticSegment = response.path.includes(' Q ') || response.path.includes('Q ');
    if (!hasQuadraticSegment) {
      const points = response.points;
      const allSameX = points.every((point) => point.x === points[0].x);
      const allSameY = points.every((point) => point.y === points[0].y);
      expect(allSameX || allSameY).toBe(true);
    }
  });

  it('supports pivots (anchors chain): path starts at source and ends at target', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(200, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 20,
      waypoints: [pure.point(100, 100)],
    };

    const response = builder.handle(request);

    expectCommon(response);

    expect(response.points[0]).toEqual(request.source);
    expect(response.points[response.points.length - 1]).toEqual(request.target);
    expect(response.candidates?.length ?? 0).toBeGreaterThan(0);
  });
});
