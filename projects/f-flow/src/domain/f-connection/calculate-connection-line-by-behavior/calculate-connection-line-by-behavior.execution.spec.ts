import { TestBed } from '@angular/core/testing';
import { CalculateConnectionLineByBehaviorExecution } from './calculate-connection-line-by-behavior.execution';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';
import { EFConnectionBehavior } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { setupTestModule } from '../../test-setup';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, PointExtensions } from '@foblex/2d';

describe('CalculateConnectionLineByBehaviorExecution', () => {
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ CalculateConnectionLineByBehaviorExecution ]);
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should handle floating behavior correctly', () => {
    const result: ILine = fMediator.send(new CalculateConnectionLineByBehaviorRequest(
      RoundedRect.fromRect({ x: 0, y: 0, width: 100, height: 100, gravityCenter: PointExtensions.initialize(50, 50) }),
      RoundedRect.fromRect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        gravityCenter: PointExtensions.initialize(150, 150)
      }),
      EFConnectionBehavior.FLOATING,
      EFConnectableSide.AUTO,
      EFConnectableSide.AUTO
    ));

    expect(result.point1.x).toEqual(100);
    expect(result.point2.y).toEqual(100);
  });

  it('should handle fixed center behavior correctly', () => {
    const result: ILine = fMediator.send(new CalculateConnectionLineByBehaviorRequest(
      RoundedRect.fromRect({ x: 0, y: 0, width: 100, height: 100, gravityCenter: PointExtensions.initialize(50, 50) }),
      RoundedRect.fromRect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        gravityCenter: PointExtensions.initialize(150, 150)
      }),
      EFConnectionBehavior.FIXED_CENTER,
      EFConnectableSide.AUTO,
      EFConnectableSide.AUTO
    ));

    expect(result.point1.x).toEqual(50);
    expect(result.point2.y).toEqual(150);
  });

  it('should handle fixed outbound behavior correctly', () => {
    const result: ILine = fMediator.send(new CalculateConnectionLineByBehaviorRequest(
      RoundedRect.fromRect({ x: 0, y: 0, width: 100, height: 100, gravityCenter: PointExtensions.initialize(50, 50) }),
      RoundedRect.fromRect({
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        gravityCenter: PointExtensions.initialize(150, 150)
      }),
      EFConnectionBehavior.FIXED,
      EFConnectableSide.LEFT,
      EFConnectableSide.RIGHT
    ));

    expect(result.point1.x).toEqual(0);
    expect(result.point2.y).toEqual(150);
  });
});
