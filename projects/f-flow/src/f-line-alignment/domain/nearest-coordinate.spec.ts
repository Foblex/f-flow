import { IRect, PointExtensions } from '@foblex/2d';
import { INearestCoordinateResult } from './i-nearest-coordinate-result';
import { NearestCoordinateFinder } from './nearest-coordinate';

describe('NearestCoordinateFinder', () => {
  let elements: IRect[];
  let target: IRect;

  beforeEach(() => {
    elements = [
      { x: 0, y: 0, width: 100, height: 100, gravityCenter: PointExtensions.initialize(50, 50) },
      { x: 200, y: 200, width: 100, height: 100, gravityCenter: PointExtensions.initialize(250, 250) },
      { x: 400, y: 400, width: 100, height: 100, gravityCenter: PointExtensions.initialize(450, 450) }
    ];
    target = { x: 150, y: 150, width: 100, height: 100, gravityCenter: PointExtensions.initialize(200, 200) };
  });

  it('findNearestCoordinateByX should return undefined', () => {
    const finder = new NearestCoordinateFinder(elements, target, 10);
    const result: INearestCoordinateResult = finder.findNearestCoordinateByX();

    expect(result.value).toBeUndefined();
    expect(result.distance).toBeUndefined();
  });

  it('findNearestCoordinateByY should return undefined', () => {
    const finder = new NearestCoordinateFinder(elements, target, 10);
    const result: INearestCoordinateResult = finder.findNearestCoordinateByY();

    expect(result.value).toBeUndefined();
    expect(result.distance).toBeUndefined();
  });

  it('should find the nearest left side by X axis', () => {
    target = { x: 105, y: 0, width: 10, height: 10, gravityCenter: PointExtensions.initialize(110, 5) };
    const finder = new NearestCoordinateFinder(elements, target, 10);
    const result: INearestCoordinateResult = finder.findNearestCoordinateByX();

    expect(result.value).toBe(100); // Right side of the first element
    expect(result.distance).toBeCloseTo(5); // Distance between target.x and element.x + element.width
  });

  it('should find the nearest top side by Y axis', () => {
    target = { x: 0, y: 105, width: 10, height: 10, gravityCenter: PointExtensions.initialize(5, 110) };
    const finder = new NearestCoordinateFinder(elements, target, 10);
    const result: INearestCoordinateResult = finder.findNearestCoordinateByY();

    expect(result.value).toBe(100); // Bottom side of the first element
    expect(result.distance).toBeCloseTo(5); // Distance between target.y and element.y + element.height
  });

  it('should return undefined if no element is within the align threshold by X axis', () => {
    const finder = new NearestCoordinateFinder(elements, target, 5); // Smaller threshold
    const result: INearestCoordinateResult = finder.findNearestCoordinateByX();

    expect(result.value).toBeUndefined();
    expect(result.distance).toBeUndefined();
  });

  it('should return undefined if no element is within the align threshold by Y axis', () => {
    const finder = new NearestCoordinateFinder(elements, target, 5); // Smaller threshold
    const result: INearestCoordinateResult = finder.findNearestCoordinateByY();

    expect(result.value).toBeUndefined();
    expect(result.distance).toBeUndefined();
  });
});
