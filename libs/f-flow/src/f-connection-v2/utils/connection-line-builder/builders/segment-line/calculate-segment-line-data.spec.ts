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

  function isOnPolyline(points: { x: number; y: number }[], p: { x: number; y: number }): boolean {
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const withinX = p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x);
      const withinY = p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
      const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
      if (withinX && withinY && Math.abs(cross) < 1e-6) {
        return true;
      }
    }

    return false;
  }

  it('routes through a waypoint without connector stubs around it (issue #324)', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(110, 60),
      target: pure.point(268, 250),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 12,
      waypoints: [pure.point(330, 30)],
    };

    const response = builder.handle(request);

    expect(response.points).toEqual([
      pure.point(110, 60),
      pure.point(122, 60),
      pure.point(122, 30),
      pure.point(330, 30),
      pure.point(330, 238),
      pure.point(268, 238),
      pure.point(268, 250),
    ]);
  });

  it('keeps every waypoint on the polyline, including detour waypoints', () => {
    const waypoints = [pure.point(-60, 90), pure.point(150, -40)];
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(300, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.RIGHT,
      radius: 0,
      offset: 12,
      waypoints,
    };

    const response = builder.handle(request);

    for (const waypoint of waypoints) {
      expect(isOnPolyline(response.points, waypoint))
        .withContext(`waypoint (${waypoint.x},${waypoint.y})`)
        .toBe(true);
    }
  });

  it('maps a rounded-corner waypoint handle to the bend apex on the path', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(110, 60),
      target: pure.point(268, 250),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      radius: 8,
      offset: 12,
      waypoints: [pure.point(200, 30), pure.point(330, 30)],
    };

    const response = builder.handle(request);

    // The mid-segment waypoint is already on the line; the corner waypoint
    // maps to the apex of its rounded bend: b + 0.25 * radius * (dout - din).
    expect(response.waypointHandles).toEqual([pure.point(200, 30), pure.point(328, 32)]);

    const sharp = builder.handle({ ...request, radius: 0 });
    expect(sharp.waypointHandles).toEqual([pure.point(200, 30), pure.point(330, 30)]);
  });

  it('places waypoint-creation candidates on straight segments of the polyline', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(300, 300),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      radius: 10,
      offset: 12,
      waypoints: [pure.point(150, -40), pure.point(350, 150)],
    };

    const response = builder.handle(request);

    expect(response.candidates?.length).toBe(3);
    for (const candidate of response.candidates ?? []) {
      expect(isOnPolyline(response.points, candidate))
        .withContext(`candidate (${candidate.x},${candidate.y})`)
        .toBe(true);
    }
  });
});
