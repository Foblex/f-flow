import { TestBed } from '@angular/core/testing';
import { SelectRequest } from './select.request';
import { FMediator } from '@foblex/mediator';
import { SelectExecution } from './select.execution';
import { setupTestModule } from '../../test-setup';
import { FDraggableDataContext } from '../../../f-draggable';
import { FComponentsStore } from '../../../f-storage';
import { signal } from "@angular/core";

describe('SelectExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fComponentsStore: FComponentsStore;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ SelectExecution ]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fComponentsStore = TestBed.inject(FComponentsStore) as jasmine.SpyObj<FComponentsStore>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should deselect all items and clear selectedItems array', () => {
    const mockSelectedItems = [
      { unmarkAsSelected: jasmine.createSpy('unmarkAsSelected') },
      { unmarkAsSelected: jasmine.createSpy('unmarkAsSelected') },
    ];
    fDraggableDataContext.selectedItems = mockSelectedItems as any;

    fMediator.execute(new SelectRequest([], []));

    mockSelectedItems.forEach(item => {
      expect(item.unmarkAsSelected).toHaveBeenCalled();
    });
    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should select nodes and connections based on request', () => {
    const mockNode = { fId: signal('node1'), markAsSelected: jasmine.createSpy('markAsSelected') };
    const mockConnection = { fId: signal('conn1'), markAsSelected: jasmine.createSpy('markAsSelected') };

    fComponentsStore.fNodes = [mockNode] as any;
    fComponentsStore.fConnections = [mockConnection] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.execute(new SelectRequest(['node1'], ['conn1']));

    expect(mockNode.markAsSelected).toHaveBeenCalled();
    expect(mockConnection.markAsSelected).toHaveBeenCalled();
    expect(fDraggableDataContext.selectedItems.length).toEqual(2);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should not select non-existing nodes and connections', () => {
    fComponentsStore.fNodes = [] as any;
    fComponentsStore.fConnections = [] as any;
    fDraggableDataContext.selectedItems = [];

    fMediator.execute(new SelectRequest(['nonexistentNode'], ['nonexistentConnection']));

    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });
});
