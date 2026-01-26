import {
  CalculateStraightLineData,
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';

describe('CalculateStraightLineData', () => {
  let builder: CalculateStraightLineData;

  beforeEach(() => {
    builder = new CalculateStraightLineData();
  });

  it('should build a straight path for a horizontal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 0,
      waypoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 100.0002 0.0002');

    expect(response.points).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]);

    expect(response.secondPoint).toEqual({ x: 100, y: 0 });
    expect(response.penultimatePoint).toEqual({ x: 0, y: 0 });

    expect(response.candidates.length).toBe(1);
    expect(response.candidates[0]).toEqual({ x: 50, y: 0 });
  });

  it('should build a straight path for a vertical connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 100 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 0,
      waypoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 0.0002 100.0002');

    expect(response.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 100 },
    ]);

    expect(response.secondPoint).toEqual({ x: 0, y: 100 });
    expect(response.penultimatePoint).toEqual({ x: 0, y: 0 });

    expect(response.candidates.length).toBe(1);
    expect(response.candidates[0]).toEqual({ x: 0, y: 50 });
  });

  it('should build a straight path for a diagonal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 0,
      waypoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 100.0002 100.0002');

    expect(response.points).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ]);

    expect(response.secondPoint).toEqual({ x: 100, y: 100 });
    expect(response.penultimatePoint).toEqual({ x: 0, y: 0 });

    expect(response.candidates.length).toBe(1);
    expect(response.candidates[0]).toEqual({ x: 50, y: 50 });
  });

  it('should support pivots and build multi-segment straight path', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 10, y: 20 },
      target: { x: 110, y: 120 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 0,
      waypoints: [
        { x: 60, y: 20 },
        { x: 60, y: 90 },
      ],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.points).toEqual([
      { x: 10, y: 20 },
      { x: 60, y: 20 },
      { x: 60, y: 90 },
      { x: 110, y: 120 },
    ]);

    expect(response.path).toBe('M 10 20' + ' L 60 20' + ' L 60 90' + ' L 110.0002 120.0002');

    expect(response.secondPoint).toEqual({ x: 60, y: 20 });
    expect(response.penultimatePoint).toEqual({ x: 60, y: 90 });

    expect(response.candidates.length).toBe(3);
    expect(response.candidates[0]).toEqual({ x: 35, y: 20 });
    expect(response.candidates[1]).toEqual({ x: 60, y: 55 });
    expect(response.candidates[2]).toEqual({ x: 85, y: 105 });
  });
});
