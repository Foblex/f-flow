import {
  connectionFactory,
  configureDiTest,
  createMediatorHarness,
  createSpy,
  FComponentsStore,
  FDraggableDataContext,
  injectFromDi,
  MediatorHarness,
  nodeFactory,
  registryAdd,
  SelectAll,
  SelectAllRequest,
  selectableFactory,
} from '@foblex/flow';

describe('SelectAll', () => {
  let draggableDataContext: FDraggableDataContext;
  let componentsStore: FComponentsStore;
  let mediator: MediatorHarness;

  beforeEach(() => {
    configureDiTest({ providers: [SelectAll] });
    draggableDataContext = injectFromDi(FDraggableDataContext);
    componentsStore = injectFromDi(FComponentsStore);
    mediator = createMediatorHarness();
  });

  it('should unmarkAsSelected all items and clear selectedItems array', () => {
    const firstUnmark = createSpy('firstUnmark');
    const secondUnmark = createSpy('secondUnmark');

    draggableDataContext.selectedItems = [
      selectableFactory().id('selected-1').selected(true).onUnmarkAsSelected(firstUnmark).build(),
      selectableFactory().id('selected-2').selected(true).onUnmarkAsSelected(secondUnmark).build(),
    ];

    mediator.execute<void>(new SelectAllRequest());

    expect(firstUnmark).toHaveBeenCalledTimes(1);
    expect(secondUnmark).toHaveBeenCalledTimes(1);
    expect(draggableDataContext.selectedItems.length).toBe(0);
    expect(draggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should select all nodes and connections', () => {
    const markNode = createSpy('markNode');
    const markConnection = createSpy('markConnection');

    const node = nodeFactory().id('node1').onMarkAsSelected(markNode).build();
    const connection = connectionFactory().id('conn1').onMarkAsSelected(markConnection).build();

    registryAdd(componentsStore.nodes, node);
    registryAdd(componentsStore.connections, connection);
    draggableDataContext.selectedItems = [];

    mediator.execute<void>(new SelectAllRequest());

    expect(markNode).toHaveBeenCalledTimes(1);
    expect(markConnection).toHaveBeenCalledTimes(1);
    expect(draggableDataContext.selectedItems).toEqual([node, connection]);
    expect(draggableDataContext.isSelectedChanged).toBe(true);
  });

  it('should handle empty nodes and connections arrays', () => {
    draggableDataContext.selectedItems = [];

    mediator.execute<void>(new SelectAllRequest());

    expect(draggableDataContext.selectedItems.length).toBe(0);
    expect(draggableDataContext.isSelectedChanged).toBe(true);
  });
});
