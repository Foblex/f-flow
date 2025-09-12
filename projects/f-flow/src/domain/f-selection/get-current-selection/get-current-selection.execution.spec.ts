import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import { GetCurrentSelectionExecution } from './get-current-selection.execution';
import { GetCurrentSelectionRequest } from './get-current-selection.request';
import { setupTestModule } from '../../test-setup';
import { FDraggableDataContext, FSelectionChangeEvent } from '../../../f-draggable';

describe('GetSelectionExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ GetCurrentSelectionExecution ]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should return correct FSelectionChangeEvent when nodes and connections are selected', () => {
    const mockSelectedItems = [
      {
        hostElement: {
          classList: { contains: (className: string) => className === 'f-node' },
          dataset: { fNodeId: 'node1' },
          id: 'connection1',
        },
      },
      {
        hostElement: {
          classList: { contains: (className: string) => className === 'f-group' },
          dataset: { fGroupId: 'group1' },
          id: 'group1',
        },
      },
      {
        hostElement: {
          classList: { contains: (className: string) => className === 'f-connection' },
          dataset: {},
          id: 'connection2',
        },
      },
    ];
    fDraggableDataContext.selectedItems = mockSelectedItems as any;

    const result = fMediator.execute<FSelectionChangeEvent>(new GetCurrentSelectionRequest());

    expect(result.fNodeIds).toEqual([ 'node1' ]);
    expect(result.fGroupIds).toEqual([ 'group1' ]);
    expect(result.fConnectionIds).toEqual([ 'connection2' ]);
  });

  it('should return empty FSelectionChangeEvent when no items are selected', () => {
    fDraggableDataContext.selectedItems = [];

    const result = fMediator.execute<FSelectionChangeEvent>(new GetCurrentSelectionRequest());

    expect(result.fNodeIds).toEqual([]);
    expect(result.fConnectionIds).toEqual([]);
  });
});
