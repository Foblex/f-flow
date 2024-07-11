import { TestBed } from '@angular/core/testing';
import { FDraggableDataContext } from '../../f-draggable';
import { FFlowMediator } from '../../infrastructure';
import { ISelectable } from '../../f-connection';
import { ClearSelectionRequest } from './clear-selection.request';
import { MOCK_SELECTABLE_ITEM, setupTestModule } from '../test-setup';
import { Injectable } from '@angular/core';
import { ClearSelectionExecution } from './clear-selection.execution';

@Injectable()
class MockFDraggableDataContext {
  selectedItems: ISelectable[] = [];
  isSelectedChanged = false;
}

describe('ClearSelectionExecution', () => {
  let fDraggableDataContext: MockFDraggableDataContext;
  let fMediator: FFlowMediator;

  beforeEach(() => {
    setupTestModule([
      { provide: FDraggableDataContext, useClass: MockFDraggableDataContext },
      ClearSelectionExecution
    ])

    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fMediator = TestBed.inject(FFlowMediator) as jasmine.SpyObj<FFlowMediator>;
  });

  it('should deselect all selected items and clear the selectedItems array when clearSelection is called through FMediator', () => {
    fDraggableDataContext.selectedItems = [ MOCK_SELECTABLE_ITEM, MOCK_SELECTABLE_ITEM ];
    fDraggableDataContext.isSelectedChanged = false;

    expect(fDraggableDataContext.selectedItems.length).toBe(2);
    expect(fDraggableDataContext.isSelectedChanged).toBe(false);

    fMediator.send<void>(new ClearSelectionRequest());
    expect(fDraggableDataContext.selectedItems.length).toBe(0);
    expect(fDraggableDataContext.isSelectedChanged).toBe(true);
  });
});
