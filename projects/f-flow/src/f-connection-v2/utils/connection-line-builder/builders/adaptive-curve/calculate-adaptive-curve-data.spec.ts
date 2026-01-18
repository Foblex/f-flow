import {
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';
import { CalculateAdaptiveCurveData } from '@foblex/flow';

describe('CalculateAdaptiveCurveData', () => {
  let builder: CalculateAdaptiveCurveData;

  beforeEach(() => {
    builder = new CalculateAdaptiveCurveData();
  });

  function expectCenterWithinPointsBBox(resp: IFConnectionBuilderResponse) {
    const xs = resp.points?.map((p) => p.x) || [];
    const ys = resp.points?.map((p) => p.y) || [];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    expect(resp.connectionCenter).toBeDefined();
    expect(Number.isFinite(resp.connectionCenter.x)).toBe(true);
    expect(Number.isFinite(resp.connectionCenter.y)).toBe(true);

    const EPS = 1e-2;
    expect(resp.connectionCenter.x).toBeGreaterThanOrEqual(minX - EPS);
    expect(resp.connectionCenter.x).toBeLessThanOrEqual(maxX + EPS);
    expect(resp.connectionCenter.y).toBeGreaterThanOrEqual(minY - EPS);
    expect(resp.connectionCenter.y).toBeLessThanOrEqual(maxY + EPS);
  }

  it('builds a path and center for a horizontal connection (left → right)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 20,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.path.startsWith('M 0 0 C')).toBe(true); // cubic path
    expect(response.points?.length).toBe(33); // 32 samples + start
    expect(response.secondPoint).toBeDefined();
    expect(response.penultimatePoint).toBeDefined();

    expect(response.connectionCenter.x).toBeCloseTo(50, 5);
    expect(response.connectionCenter.y).toBeCloseTo(0, 5);
  });

  it('builds a path and center for a vertical connection (top → bottom)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 100 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 10,
      offset: 20,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.path.startsWith('M 0 0 C')).toBe(true);
    expect(response.points?.length).toBe(33);

    expect(response.connectionCenter.x).toBeCloseTo(0, 5);
    expect(response.connectionCenter.y).toBeCloseTo(50, 5);
  });

  it('builds a path and center for a diagonal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 10,
      offset: 20,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.path).toContain('C');
    expect(response.points?.length).toBe(33);

    expectCenterWithinPointsBBox(response);
  });

  it('builds a path and center for a connection with offset', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 50, y: 50 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.LEFT,
      radius: 10,
      offset: 30,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.path).toContain('C');
    expect(response.points?.length).toBe(33);
    expectCenterWithinPointsBBox(response);
  });

  it('ensures control points are not equal to anchors (non-degenerate handles)', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 10, y: 20 },
      target: { x: 110, y: 120 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 16,
    };

    const response = builder.handle(request);

    const { secondPoint: c1, penultimatePoint: c2 } = response;
    expect(c1).toBeDefined();
    expect(c2).toBeDefined();

    expect(!(c1.x === request.source.x && c1.y === request.source.y)).toBe(true);
    expect(!(c2.x === request.target.x && c2.y === request.target.y)).toBe(true);

    expectCenterWithinPointsBBox(response);
  });
});
