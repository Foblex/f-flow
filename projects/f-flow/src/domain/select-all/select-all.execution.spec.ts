import { TestBed } from '@angular/core/testing';
import { SelectAllRequest } from './select-all.request';
import { FDraggableDataContext } from '../../f-draggable';
import { FComponentsStore } from '../../f-storage';
import { FFlowMediator } from '../../infrastructure';
import { SelectAllExecution } from './select-all.execution';
import { setupTestModule } from '../test-setup';

describe('SelectAllExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fComponentsStore: FComponentsStore;
  let fMediator: FFlowMediator;

  beforeEach(() => {
    setupTestModule([SelectAllExecution]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fComponentsStore = TestBed.inject(FComponentsStore) as jasmine.SpyObj<FComponentsStore>;
    fMediator = TestBed.inject(FFlowMediator) as jasmine.SpyObj<FFlowMediator>;
  });

  it('should deselect all items and clear selectedItems array', () => {
    const mockSelectedItems = [
      { deselect: jasmine.createSpy('deselect') },
      { deselect: jasmine.createSpy('deselect') }
    ];
    fDraggableDataContext.selectedItems = mockSelectedItems as any;

    fMediator.send(new SelectAllRequest());

    mockSelectedItems.forEach(item => {
      expect(item.deselect).toHaveBeenCalled();
    });
    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should select all nodes and connections', () => {
    const mockNode = { fId: 'node1', select: jasmine.createSpy('select') };
    const mockConnection = { fConnectionId: 'conn1', select: jasmine.createSpy('select') };

    fComponentsStore.fNodes = [mockNode] as any;
    fComponentsStore.fConnections = [mockConnection] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.send(new SelectAllRequest());

    expect(mockNode.select).toHaveBeenCalled();
    expect(mockConnection.select).toHaveBeenCalled();
    expect(fDraggableDataContext.selectedItems.length).toEqual(2);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should handle empty nodes and connections arrays', () => {
    fComponentsStore.fNodes = [] as any;
    fComponentsStore.fConnections = [] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.send(new SelectAllRequest());

    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });
});
