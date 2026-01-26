import { IFConnectionBuilderRequest, IFConnectionBuilderResponse } from '../../models';
import { CalculateSegmentLineData, EFConnectableSide } from '@foblex/flow';

describe('CalculateSegmentLineData', () => {
  let builder: CalculateSegmentLineData;

  beforeEach(() => {
    builder = new CalculateSegmentLineData();
  });

  function expectCommon(response: IFConnectionBuilderResponse) {
    expect(response.path).toBeTruthy();
    expect(response.points).toBeTruthy();
    expect(Array.isArray(response.points)).toBe(true);
    expect(response.points.length).toBeGreaterThanOrEqual(2);

    const pts = response.points;
    expect(response.secondPoint).toEqual(pts[1]);
    expect(response.penultimatePoint).toEqual(pts[pts.length - 2]);
  }

  it('builds a path for a horizontal connection (RIGHT -> LEFT)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
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
      source: { x: 0, y: 0 },
      target: { x: 0, y: 100 },
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
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
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
      source: { x: 0, y: 0 },
      target: { x: 50, y: 50 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 30,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);

    const p1 = response.points[1];
    expect(p1.x !== request.source.x || p1.y !== request.source.y).toBe(true);
  });

  it('produces quadratic bends (Q) when radius > 0 and there is at least one corner', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 20,
      waypoints: [],
    };

    const response = builder.handle(request);

    expectCommon(response);

    const hasQ = response.path.includes(' Q ') || response.path.includes('Q ');
    if (!hasQ) {
      const pts = response.points;
      const allSameX = pts.every((p) => p.x === pts[0].x);
      const allSameY = pts.every((p) => p.y === pts[0].y);
      expect(allSameX || allSameY).toBe(true);
    }
  });

  it('supports pivots (anchors chain): path starts at source and ends at target', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 200, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 20,
      waypoints: [{ x: 100, y: 100 }], // один pivot
    };

    const response = builder.handle(request);

    expectCommon(response);

    expect(response.points[0]).toEqual(request.source);
    expect(response.points[response.points.length - 1]).toEqual(request.target);
    expect(response.candidates?.length ?? 0).toBeGreaterThan(0);
  });
});
