import { CalculateCenterBetweenPointsHandler } from './calculate-center-between-points.handler';
import { PointExtensions, IPoint } from '@foblex/core';
import { CalculateCenterBetweenPointsRequest } from './calculate-center-between-points-request';

describe('CalculateCenterBetweenPointsHandler', () => {
  let handler: CalculateCenterBetweenPointsHandler;

  beforeEach(() => {
    handler = new CalculateCenterBetweenPointsHandler();
  });

  it('should calculate center between two points when target.x > source.x and target.y > source.y', () => {
    const source: IPoint = { x: 0, y: 0 };
    const target: IPoint = { x: 4, y: 4 };
    const request = new CalculateCenterBetweenPointsRequest(source, target);

    const result = handler.handle(request);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x < source.x and target.y < source.y', () => {
    const source: IPoint = { x: 4, y: 4 };
    const target: IPoint = { x: 0, y: 0 };
    const request = new CalculateCenterBetweenPointsRequest(source, target);

    const result = handler.handle(request);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x > source.x and target.y < source.y', () => {
    const source: IPoint = { x: 0, y: 4 };
    const target: IPoint = { x: 4, y: 0 };
    const request = new CalculateCenterBetweenPointsRequest(source, target);

    const result = handler.handle(request);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x < source.x and target.y > source.y', () => {
    const source: IPoint = { x: 4, y: 0 };
    const target: IPoint = { x: 0, y: 4 };
    const request = new CalculateCenterBetweenPointsRequest(source, target);

    const result = handler.handle(request);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center when source and target are the same point', () => {
    const source: IPoint = { x: 4, y: 4 };
    const target: IPoint = { x: 4, y: 4 };
    const request = new CalculateCenterBetweenPointsRequest(source, target);

    const result = handler.handle(request);

    expect(result).toEqual(PointExtensions.initialize(4, 4));
  });
});
