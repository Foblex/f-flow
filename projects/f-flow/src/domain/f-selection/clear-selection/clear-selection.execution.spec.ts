import {
  ClearSelectionExecution,
  ClearSelectionRequest,
  configureDiTest,
  createMediatorHarness,
  createSpy,
  FDraggableDataContext,
  injectFromDi,
  MediatorHarness,
  selectableFactory,
} from '@foblex/flow';

describe('ClearSelectionExecution', () => {
  let draggableDataContext: FDraggableDataContext;
  let mediator: MediatorHarness;

  beforeEach(() => {
    configureDiTest({ providers: [ClearSelectionExecution] });
    draggableDataContext = injectFromDi(FDraggableDataContext);
    mediator = createMediatorHarness();
  });

  it('should deselect all selected items and clear the selectedItems array when clearSelection is called through FMediator', () => {
    const firstUnmark = createSpy('firstUnmark');
    const secondUnmark = createSpy('secondUnmark');

    draggableDataContext.selectedItems = [
      selectableFactory().id('item-1').selected(true).onUnmarkAsSelected(firstUnmark).build(),
      selectableFactory().id('item-2').selected(true).onUnmarkAsSelected(secondUnmark).build(),
    ];
    draggableDataContext.isSelectedChanged = false;

    expect(draggableDataContext.selectedItems.length).toBe(2);
    expect(draggableDataContext.isSelectedChanged).toBe(false);

    mediator.execute<void>(new ClearSelectionRequest());

    expect(firstUnmark).toHaveBeenCalledTimes(1);
    expect(secondUnmark).toHaveBeenCalledTimes(1);
    expect(draggableDataContext.selectedItems.length).toBe(0);
    expect(draggableDataContext.isSelectedChanged).toBe(true);
  });
});
