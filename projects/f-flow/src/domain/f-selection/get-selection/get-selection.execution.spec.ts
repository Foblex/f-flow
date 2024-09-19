import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import { GetSelectionExecution } from './get-selection.execution';
import { GetSelectionRequest } from './get-selection.request';
import { setupTestModule } from '../../test-setup';
import { FDraggableDataContext, FSelectionChangeEvent } from '@foblex/flow';

describe('GetSelectionExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ GetSelectionExecution ]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should return correct FSelectionChangeEvent when nodes and connections are selected', () => {
    const mockSelectedItems = [
      {
        hostElement: {
          classList: { contains: (className: string) => className === 'f-node' },
          dataset: { fNodeId: 'node1' },
          id: 'connection1'
        }
      },
      {
        hostElement: {
          classList: { contains: (className: string) => className !== 'f-node' },
          dataset: {},
          id: 'connection2'
        }
      }
    ];
    fDraggableDataContext.selectedItems = mockSelectedItems as any;

    const result = fMediator.send<FSelectionChangeEvent>(new GetSelectionRequest());

    expect(result.nodes).toEqual([ 'node1' ]);
    expect(result.connections).toEqual([ 'connection2' ]);
  });

  it('should return empty FSelectionChangeEvent when no items are selected', () => {
    fDraggableDataContext.selectedItems = [];

    const result = fMediator.send<FSelectionChangeEvent>(new GetSelectionRequest());

    expect(result.nodes).toEqual([]);
    expect(result.connections).toEqual([]);
  });
});
