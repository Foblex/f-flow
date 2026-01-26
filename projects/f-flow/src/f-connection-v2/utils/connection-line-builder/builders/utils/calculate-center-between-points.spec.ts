import { PointExtensions, IPoint } from '@foblex/2d';
import { TestBed } from '@angular/core/testing';
import { calculateCenterBetweenPoints } from '@foblex/flow';

describe('calculateCenterBetweenPoints', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should calculate center between two points when target.x > source.x and target.y > source.y', () => {
    const source: IPoint = { x: 0, y: 0 };
    const target: IPoint = { x: 4, y: 4 };

    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x < source.x and target.y < source.y', () => {
    const source: IPoint = { x: 4, y: 4 };
    const target: IPoint = { x: 0, y: 0 };
    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x > source.x and target.y < source.y', () => {
    const source: IPoint = { x: 0, y: 4 };
    const target: IPoint = { x: 4, y: 0 };
    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x < source.x and target.y > source.y', () => {
    const source: IPoint = { x: 4, y: 0 };
    const target: IPoint = { x: 0, y: 4 };
    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center when source and target are the same point', () => {
    const source: IPoint = { x: 4, y: 4 };
    const target: IPoint = { x: 4, y: 4 };
    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(4, 4));
  });
});
