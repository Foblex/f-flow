import {
  CalculateStraightLineData,
  createPureHarness,
  EFConnectableSide,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '@foblex/flow';

describe('CalculateStraightLineData', () => {
  let builder: CalculateStraightLineData;
  const pure = createPureHarness();

  beforeEach(() => {
    builder = new CalculateStraightLineData();
  });

  it('should build a straight path for a horizontal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 0),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 0,
      waypoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 100.0002 0.0002');
    expect(response.points).toEqual([pure.point(0, 0), pure.point(100, 0)]);

    expect(response.secondPoint).toEqual(pure.point(100, 0));
    expect(response.penultimatePoint).toEqual(pure.point(0, 0));

    expect(response.candidates.length).toBe(1);
    expect(response.candidates[0]).toEqual(pure.point(50, 0));
  });

  it('should build a straight path for a vertical connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(0, 100),
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 0,
      waypoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 0.0002 100.0002');
    expect(response.points).toEqual([pure.point(0, 0), pure.point(0, 100)]);

    expect(response.secondPoint).toEqual(pure.point(0, 100));
    expect(response.penultimatePoint).toEqual(pure.point(0, 0));

    expect(response.candidates.length).toBe(1);
    expect(response.candidates[0]).toEqual(pure.point(0, 50));
  });

  it('should build a straight path for a diagonal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(0, 0),
      target: pure.point(100, 100),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 0,
      waypoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 100.0002 100.0002');
    expect(response.points).toEqual([pure.point(0, 0), pure.point(100, 100)]);

    expect(response.secondPoint).toEqual(pure.point(100, 100));
    expect(response.penultimatePoint).toEqual(pure.point(0, 0));

    expect(response.candidates.length).toBe(1);
    expect(response.candidates[0]).toEqual(pure.point(50, 50));
  });

  it('should support pivots and build multi-segment straight path', () => {
    const request: IFConnectionBuilderRequest = {
      source: pure.point(10, 20),
      target: pure.point(110, 120),
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 0,
      waypoints: [pure.point(60, 20), pure.point(60, 90)],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.points).toEqual([
      pure.point(10, 20),
      pure.point(60, 20),
      pure.point(60, 90),
      pure.point(110, 120),
    ]);

    expect(response.path).toBe('M 10 20' + ' L 60 20' + ' L 60 90' + ' L 110.0002 120.0002');

    expect(response.secondPoint).toEqual(pure.point(60, 20));
    expect(response.penultimatePoint).toEqual(pure.point(60, 90));

    expect(response.candidates.length).toBe(3);
    expect(response.candidates[0]).toEqual(pure.point(35, 20));
    expect(response.candidates[1]).toEqual(pure.point(60, 55));
    expect(response.candidates[2]).toEqual(pure.point(85, 105));
  });
});
