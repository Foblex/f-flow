import { FBezierPathBuilder } from './f-bezier.path-builder';
import { IFConnectionBuilderRequest, IFConnectionBuilderResponse } from '../../f-connection-builder';
import { EFConnectableSide } from '../../../f-connectors';

describe('FBezierPathBuilder', () => {
  let builder: FBezierPathBuilder;

  beforeEach(() => {
    builder = new FBezierPathBuilder();
  });

  it('should build a path and calculate the center for a horizontal connection from left to right', () => {
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
    expect(response.connectionCenter).toBeDefined();
    expect(response.connectionCenter.x).toBeCloseTo(50);
    expect(response.connectionCenter.y).toBeCloseTo(0);
  });

  it('should build a path and calculate the center for a vertical connection from top to bottom', () => {
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
    expect(response.connectionCenter).toBeDefined();
    expect(response.connectionCenter.x).toBeCloseTo(0);
    expect(response.connectionCenter.y).toBeCloseTo(50);
  });

  it('should build a path and calculate the center for a diagonal connection', () => {
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
    expect(response.connectionCenter).toBeDefined();
    expect(response.connectionCenter.x).toBeCloseTo(100);
    expect(response.connectionCenter.y).toBeCloseTo(219.08902300206648);
  });

  it('should build a path and calculate the center for a connection with an offset', () => {
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
    expect(response.connectionCenter).toBeDefined();
    expect(response.connectionCenter.x).toBeCloseTo(0);
    expect(response.connectionCenter.y).toBeCloseTo(50);
  });
});
