import { FCustomPathBuilder } from './f-custom-path.builder';
import {
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../f-connection-builder';
import { EFConnectableSide } from '../../../f-connectors';

describe('FCustomPathBuilder', () => {
  let builder: FCustomPathBuilder;

  beforeEach(() => {
    builder = new FCustomPathBuilder();
  });

  it('should create a straight path when no control points are provided', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.AUTO,
      targetSide: EFConnectableSide.AUTO,
      radius: 0,
      offset: 0,
      controlPoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.path).toContain('M0 0');
    expect(response.path).toContain('L100.0002 100.0002');
    expect(response.connectionCenter).toBeDefined();
    expect(response.points?.length).toBe(2);
  });

  it('should create a path with one control point', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.AUTO,
      targetSide: EFConnectableSide.AUTO,
      radius: 0,
      offset: 0,
      controlPoints: [{ x: 50, y: 0 }],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.path).toContain('M0 0');
    expect(response.path).toContain('L50 0');
    expect(response.path).toContain('L100.0002 100.0002');
    expect(response.points?.length).toBe(3);
    expect(response.points).toEqual([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 100 },
    ]);
  });

  it('should create a path with multiple control points', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.AUTO,
      targetSide: EFConnectableSide.AUTO,
      radius: 0,
      offset: 0,
      controlPoints: [
        { x: 50, y: 0 },
        { x: 50, y: 50 },
        { x: 100, y: 50 },
      ],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    expect(response.points?.length).toBe(5);
    expect(response.points).toEqual([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 50 },
      { x: 100, y: 100 },
    ]);
  });

  it('should apply border radius to corners', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.AUTO,
      targetSide: EFConnectableSide.AUTO,
      radius: 10,
      offset: 0,
      controlPoints: [{ x: 50, y: 0 }],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.path).toBeDefined();
    // Should contain Q (quadratic bezier) for rounded corner
    expect(response.path).toContain('Q');
  });

  it('should calculate correct connection center', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 0 },
      sourceSide: EFConnectableSide.AUTO,
      targetSide: EFConnectableSide.AUTO,
      radius: 0,
      offset: 0,
      controlPoints: [],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.connectionCenter).toBeDefined();
    expect(response.connectionCenter.x).toBeCloseTo(50, 0);
    expect(response.connectionCenter.y).toBeCloseTo(0, 0);
  });

  it('should return correct penultimate and second points', () => {
    const request: IFConnectionBuilderRequest = {
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      sourceSide: EFConnectableSide.AUTO,
      targetSide: EFConnectableSide.AUTO,
      radius: 0,
      offset: 0,
      controlPoints: [
        { x: 50, y: 0 },
        { x: 50, y: 50 },
      ],
    };

    const response: IFConnectionBuilderResponse = builder.handle(request);

    expect(response.secondPoint).toEqual({ x: 50, y: 0 });
    expect(response.penultimatePoint).toEqual({ x: 50, y: 50 });
  });
});
