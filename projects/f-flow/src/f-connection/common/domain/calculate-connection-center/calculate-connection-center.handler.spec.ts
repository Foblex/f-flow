import { CalculateConnectionCenterHandler } from './calculate-connection-center.handler';
import { CalculateConnectionCenterRequest } from './calculate-connection-center-request';
import { IPoint } from '@foblex/2d';

describe('CalculateConnectionCenterHandler', () => {
  let handler: CalculateConnectionCenterHandler;

  beforeEach(() => {
    handler = new CalculateConnectionCenterHandler();
  });

  it('should calculate the center point of a connection with multiple points', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
    ];
    const request = new CalculateConnectionCenterRequest(points);

    const result = handler.handle(request);

    expect(result.x).toBeCloseTo(4);
    expect(result.y).toBeCloseTo(0);
  });

  it('should calculate the center point for a straight line', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
    ];
    const request = new CalculateConnectionCenterRequest(points);

    const result = handler.handle(request);

    expect(result.x).toBeCloseTo(2);
    expect(result.y).toBeCloseTo(0);
  });

  it('should calculate the center point for a single segment', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 },
      { x: 0, y: 4 },
    ];
    const request = new CalculateConnectionCenterRequest(points);

    const result = handler.handle(request);

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(2);
  });

  it('should calculate the center for points forming a non-straight path', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 },
      { x: 3, y: 4 },
      { x: 6, y: 0 },
    ];
    const request = new CalculateConnectionCenterRequest(points);

    const result = handler.handle(request);

    expect(result.x).toBeCloseTo(3);
    expect(result.y).toBeCloseTo(4);
  });
});
