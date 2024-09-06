import { TestBed } from '@angular/core/testing';
import { SelectRequest } from './select.request';
import { FDraggableDataContext } from '../../f-draggable';
import { FFlowMediator } from '../../infrastructure';
import { setupTestModule } from '../test-setup';
import { FComponentsStore } from '../../f-storage';
import { SelectExecution } from './select.execution';

describe('SelectExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fComponentsStore: FComponentsStore;
  let fMediator: FFlowMediator;

  beforeEach(() => {
    setupTestModule([ SelectExecution ]);
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

    fMediator.send(new SelectRequest([], []));

    mockSelectedItems.forEach(item => {
      expect(item.deselect).toHaveBeenCalled();
    });
    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should select nodes and connections based on request', () => {
    const mockNode = { fId: 'node1', select: jasmine.createSpy('select') };
    const mockConnection = { fId: 'conn1', select: jasmine.createSpy('select') };

    fComponentsStore.fNodes = [mockNode] as any;
    fComponentsStore.fConnections = [mockConnection] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.send(new SelectRequest(['node1'], ['conn1']));

    expect(mockNode.select).toHaveBeenCalled();
    expect(mockConnection.select).toHaveBeenCalled();
    expect(fDraggableDataContext.selectedItems.length).toEqual(2);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should not select non-existing nodes and connections', () => {
    fComponentsStore.fNodes = [] as any;
    fComponentsStore.fConnections = [] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.send(new SelectRequest(['nonexistentNode'], ['nonexistentConnection']));

    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });
});
