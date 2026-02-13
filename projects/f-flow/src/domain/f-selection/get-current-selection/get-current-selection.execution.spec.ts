import {
  configureDiTest,
  createMediatorHarness,
  FDraggableDataContext,
  FSelectionChangeEvent,
  GetCurrentSelectionExecution,
  GetCurrentSelectionRequest,
  injectFromDi,
  MediatorHarness,
  selectableFactory,
} from '@foblex/flow';

describe('GetSelectionExecution', () => {
  let draggableDataContext: FDraggableDataContext;
  let mediator: MediatorHarness;

  beforeEach(() => {
    configureDiTest({ providers: [GetCurrentSelectionExecution] });
    draggableDataContext = injectFromDi(FDraggableDataContext);
    mediator = createMediatorHarness();
  });

  it('should return correct FSelectionChangeEvent when nodes and connections are selected', () => {
    const selectedItems = [
      selectableFactory()
        .id('node-item')
        .className('f-node')
        .dataset('fNodeId', 'node1')
        .elementId('connection1')
        .build(),
      selectableFactory()
        .id('group-item')
        .className('f-group')
        .dataset('fGroupId', 'group1')
        .elementId('group1')
        .build(),
      selectableFactory().id('connection-item').elementId('connection2').build(),
    ];

    draggableDataContext.selectedItems = selectedItems;

    const result = mediator.execute<FSelectionChangeEvent>(new GetCurrentSelectionRequest());

    expect(result.fNodeIds).toEqual(['node1']);
    expect(result.fGroupIds).toEqual(['group1']);
    expect(result.fConnectionIds).toEqual(['connection2']);
  });

  it('should return empty FSelectionChangeEvent when no items are selected', () => {
    draggableDataContext.selectedItems = [];

    const result = mediator.execute<FSelectionChangeEvent>(new GetCurrentSelectionRequest());

    expect(result.fNodeIds).toEqual([]);
    expect(result.fConnectionIds).toEqual([]);
  });
});
