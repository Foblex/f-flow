import { TestBed } from '@angular/core/testing';
import { SelectAllRequest } from './select-all.request';
import { FMediator } from '@foblex/mediator';
import { SelectAllExecution } from './select-all.execution';
import { setupTestModule } from '../../test-setup';
import { FDraggableDataContext } from '../../../f-draggable';
import { FComponentsStore } from '../../../f-storage';

describe('SelectAllExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fComponentsStore: FComponentsStore;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([SelectAllExecution]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fComponentsStore = TestBed.inject(FComponentsStore) as jasmine.SpyObj<FComponentsStore>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should unmarkAsSelected all items and clear selectedItems array', () => {
    const mockSelectedItems = [
      { unmarkAsSelected: jasmine.createSpy('unmarkAsSelected') },
      { unmarkAsSelected: jasmine.createSpy('unmarkAsSelected') },
    ];
    fDraggableDataContext.selectedItems = mockSelectedItems as any;

    fMediator.execute(new SelectAllRequest());

    mockSelectedItems.forEach(item => {
      expect(item.unmarkAsSelected).toHaveBeenCalled();
    });
    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should select all nodes and connections', () => {
    const mockNode = { fId: 'node1', markAsSelected: jasmine.createSpy('markAsSelected') };
    const mockConnection = { fId: 'conn1', markAsSelected: jasmine.createSpy('markAsSelected') };

    fComponentsStore.fNodes = [mockNode] as any;
    fComponentsStore.fConnections = [mockConnection] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.execute(new SelectAllRequest());

    expect(mockNode.markAsSelected).toHaveBeenCalled();
    expect(mockConnection.markAsSelected).toHaveBeenCalled();
    expect(fDraggableDataContext.selectedItems.length).toEqual(2);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should handle empty nodes and connections arrays', () => {
    fComponentsStore.fNodes = [] as any;
    fComponentsStore.fConnections = [] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.execute(new SelectAllRequest());

    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });
});
