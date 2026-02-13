import {
  connectionFactory,
  configureDiTest,
  createSpy,
  FComponentsStore,
  FDraggableDataContext,
  injectFromDi,
  nodeFactory,
  registryAdd,
  SelectExecution,
  SelectRequest,
  selectableFactory,
} from '@foblex/flow';

describe('SelectExecution (unit)', () => {
  let execution: SelectExecution;
  let draggableDataContext: FDraggableDataContext;
  let componentsStore: FComponentsStore;

  beforeEach(() => {
    configureDiTest({ providers: [SelectExecution] });
    execution = injectFromDi(SelectExecution);
    draggableDataContext = injectFromDi(FDraggableDataContext);
    componentsStore = injectFromDi(FComponentsStore);

    draggableDataContext.selectedItems = [];
    draggableDataContext.isSelectedChanged = false;
  });

  it('clears previous selection', () => {
    const firstUnmark = createSpy('firstUnmark');
    const secondUnmark = createSpy('secondUnmark');

    const previousSelection = [
      selectableFactory().id('prev-1').onUnmarkAsSelected(firstUnmark).build(),
      selectableFactory().id('prev-2').onUnmarkAsSelected(secondUnmark).build(),
    ];

    draggableDataContext.selectedItems = previousSelection;

    execution.handle(new SelectRequest([], []));

    expect(firstUnmark).toHaveBeenCalledTimes(1);
    expect(secondUnmark).toHaveBeenCalledTimes(1);
    expect(draggableDataContext.selectedItems).toEqual([]);
    expect(draggableDataContext.isSelectedChanged).toBeTrue();
  });

  it('selects existing node and connection by id', () => {
    const markNode = createSpy('markNode');
    const markConnection = createSpy('markConnection');

    const node = nodeFactory().id('node1').onMarkAsSelected(markNode).build();
    const connection = connectionFactory().id('conn1').onMarkAsSelected(markConnection).build();

    registryAdd(componentsStore.nodes, node);
    registryAdd(componentsStore.connections, connection);

    execution.handle(new SelectRequest(['node1'], ['conn1']));

    expect(markNode).toHaveBeenCalledTimes(1);
    expect(markConnection).toHaveBeenCalledTimes(1);
    expect(draggableDataContext.selectedItems).toEqual([node, connection]);
    expect(draggableDataContext.isSelectedChanged).toBeTrue();
  });
});
