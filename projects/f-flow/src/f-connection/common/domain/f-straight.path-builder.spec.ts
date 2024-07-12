import { FStraightPathBuilder } from './f-straight.path-builder';
import { IFConnectionBuilderRequest, IFConnectionBuilderResponse } from '../../f-connection-builder';
import { EFConnectableSide } from '../../../f-connectors';


describe('FStraightPathBuilder', () => {
  let builder: FStraightPathBuilder;

  beforeEach(() => {
    builder = new FStraightPathBuilder();
  });

  it('should build a straight path and calculate the center for a horizontal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
      radius: 0,
      offset: 0,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 100.0002 0.0002');
    expect(response.connectionCenter).toEqual({ x: 50, y: 0 });
  });

  it('should build a straight path and calculate the center for a vertical connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 100 },
      sourceSide: EFConnectableSide.BOTTOM,
      targetSide: EFConnectableSide.TOP,
      radius: 0,
      offset: 0,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 0.0002 100.0002');
    expect(response.connectionCenter).toEqual({ x: 0, y: 50 });
  });

  it('should build a straight path and calculate the center for a diagonal connection', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 0,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 0 0 L 100.0002 100.0002');
    expect(response.connectionCenter).toEqual({ x: 50, y: 50 });
  });

  it('should build a straight path and calculate the center for a connection with offset', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 10, y: 20 },
      target: { x: 110, y: 120 },
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.BOTTOM,
      radius: 0,
      offset: 0,
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBe('M 10 20 L 110.0002 120.0002');
    expect(response.connectionCenter).toEqual({ x: 60, y: 70 });
  });
});
