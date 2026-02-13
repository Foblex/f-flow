import { IRect, PointExtensions } from '@foblex/2d';
import { calculateMagneticGuides } from '@foblex/flow';

describe('calculateMagneticGuides', () => {
  let elements: IRect[];
  let target: IRect;

  beforeEach(() => {
    elements = [
      { x: 0, y: 0, width: 100, height: 100, gravityCenter: PointExtensions.initialize(50, 50) },
      {
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        gravityCenter: PointExtensions.initialize(250, 250),
      },
      {
        x: 400,
        y: 400,
        width: 100,
        height: 100,
        gravityCenter: PointExtensions.initialize(450, 450),
      },
    ];
    target = {
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      gravityCenter: PointExtensions.initialize(200, 200),
    };
  });

  it('findNearestCoordinateByX should return undefined', () => {
    const result = calculateMagneticGuides(elements, target, 10);

    expect(result.x.guide).toBeUndefined();
    expect(result.x.delta).toBeUndefined();
    expect(result.y.guide).toBeUndefined();
    expect(result.y.delta).toBeUndefined();
  });

  it('should find the nearest left side by X axis', () => {
    target = {
      x: 105,
      y: 0,
      width: 10,
      height: 10,
      gravityCenter: PointExtensions.initialize(110, 5),
    };
    const result = calculateMagneticGuides(elements, target, 10);

    expect(result.x.guide).toBe(100); // Right side of the first element
    expect(result.x.delta).toBeCloseTo(5); // Distance between target.x and element.x + element.width
  });

  it('should find the nearest top side by Y axis', () => {
    target = {
      x: 0,
      y: 105,
      width: 10,
      height: 10,
      gravityCenter: PointExtensions.initialize(5, 110),
    };
    const result = calculateMagneticGuides(elements, target, 10);

    expect(result.y.guide).toBe(100); // Bottom side of the first element
    expect(result.y.delta).toBeCloseTo(5); // Distance between target.y and element.y + element.height
  });

  it('should return undefined if no element is within the align threshold by X axis', () => {
    const result = calculateMagneticGuides(elements, target, 5); // Smaller threshold

    expect(result.x.guide).toBeUndefined();
    expect(result.x.delta).toBeUndefined();
  });

  it('should return undefined if no element is within the align threshold by Y axis', () => {
    const result = calculateMagneticGuides(elements, target, 5); // Smaller threshold

    expect(result.y.guide).toBeUndefined();
    expect(result.y.delta).toBeUndefined();
  });
});
