import { TestBed } from '@angular/core/testing';
import { SelectExecution } from './select.execution';
import { SelectRequest } from './select.request';
import { mockConnection, mockNode, setupTestModule } from '../../test-setup';
import { FDraggableDataContext } from '../../../f-draggable';
import { FComponentsStore } from '../../../f-storage';
import { signal } from '@angular/core';

describe('SelectExecution (unit)', () => {
  let execution: SelectExecution;
  let ctx: FDraggableDataContext;
  let store: FComponentsStore;

  beforeEach(() => {
    setupTestModule([SelectExecution]);
    execution = TestBed.inject(SelectExecution);
    ctx = TestBed.inject(FDraggableDataContext);
    store = TestBed.inject(FComponentsStore);

    ctx.selectedItems = [];
    ctx.isSelectedChanged = false;
  });

  it('clears previous selection', () => {
    const prev = [
      { unmarkAsSelected: jasmine.createSpy('unmarkAsSelected') },
      { unmarkAsSelected: jasmine.createSpy('unmarkAsSelected') },
    ] as any;

    ctx.selectedItems = prev;

    execution.handle(new SelectRequest([], []));

    expect(prev[0].unmarkAsSelected).toHaveBeenCalledTimes(1);
    expect(prev[1].unmarkAsSelected).toHaveBeenCalledTimes(1);
    expect(ctx.selectedItems).toEqual([]);
    expect(ctx.isSelectedChanged).toBeTrue();
  });

  it('selects existing node and connection by id', () => {
    const node = mockNode({ fId: signal('node1'), markAsSelected: jasmine.createSpy('markAsSelected') });
    const conn = mockConnection({ fId: signal('conn1'), markAsSelected: jasmine.createSpy('markAsSelected') });

    store.nodes.add(node);
    store.connections.add(conn);

    execution.handle(new SelectRequest(['node1'], ['conn1']));

    expect(node.markAsSelected).toHaveBeenCalledTimes(1);
    expect(conn.markAsSelected).toHaveBeenCalledTimes(1);
    expect(ctx.selectedItems).toEqual([node, conn]);
    expect(ctx.isSelectedChanged).toBeTrue();
  });
});
