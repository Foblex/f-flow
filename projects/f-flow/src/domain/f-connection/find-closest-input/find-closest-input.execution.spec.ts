import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import { RectExtensions, RoundedRect } from '@foblex/2d';
import { setupTestModule } from '../../test-setup';
import { FDraggableDataContext } from '../../../f-draggable';
import { FindClosestInputExecution } from './find-closest-input.execution';
import { FindClosestInputRequest } from './find-closest-input.request';
import { FConnectorBase } from '../../../f-connectors';
import { IClosestInput } from '@foblex/flow';

describe('FindClosestInputExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ FindClosestInputExecution ]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should return undefined when canBeConnectedInputs is empty', () => {
    const result = fMediator.send(
      new FindClosestInputRequest({ x: 50, y: 50 }, [])
    );
    expect(result).toBeUndefined();
  });

  it('should return the only element if its distance is less than snapThreshold', () => {

    const result = fMediator.send<IClosestInput>(
      new FindClosestInputRequest({ x: 10, y: 10 }, [ {
        fConnector: {
          fId: 'input1'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(12, 12, 10, 10)),
      }, {
        fConnector: {
          fId: 'input2'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(22, 22, 10, 10)),
      }, ])
    );
    expect(result).toBeDefined();
    expect(result?.fConnector.fId).toBe('input1');
  });

  it('should return 10 if the only element is exactly at snapThreshold distance', () => {
    const result = fMediator.send<IClosestInput>(
      new FindClosestInputRequest({ x: 0, y: 0 }, [ {
        fConnector: {
          fId: 'input1'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(10, 0, 10, 10)),
      }, {
        fConnector: {
          fId: 'input2'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(22, 22, 10, 10)),
      }, ])
    );
    expect(result?.distance).toBe(10);
  });
});


