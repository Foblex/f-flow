import { TestBed } from '@angular/core/testing';
import { FDraggableDataContext } from '../../f-draggable';
import { FMediator } from '@foblex/mediator';
import { ClearSelectionRequest } from './clear-selection.request';
import { setupTestModule } from '../test-setup';
import { ClearSelectionExecution } from './clear-selection.execution';
import { ISelectable } from '../../f-connection';

export const MOCK_SELECTABLE_ITEM: ISelectable = {
  fId: '1',
  fSelectionDisabled: false,
  hostElement: document.createElement('svg'),
  select: jasmine.createSpy('select'),
  deselect: jasmine.createSpy('deselect'),
  isSelected: jasmine.createSpy('isSelected').and.returnValue(true)
};

describe('ClearSelectionExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ ClearSelectionExecution ]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
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
