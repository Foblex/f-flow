import {
  canvasFactory,
  configureDiTest,
  createMediatorHarness,
  createPureHarness,
  FCanvasBase,
  FComponentsStore,
  FNodeBase,
  GetDeepChildrenNodesAndGroupsExecution,
  injectFromDi,
  MediatorHarness,
  nodeFactory,
  registryAddMany,
  SortItemLayers,
  SortItemLayersRequest,
  SortItemsByParentExecution,
  SortNodeLayersExecution,
} from '@foblex/flow';

const pure = createPureHarness();

function createNode(id: string, parentId?: string): FNodeBase {
  return nodeFactory().id(id).parent(parentId).host(pure.element('div', { id })).build();
}

function createCanvas(): FCanvasBase {
  return canvasFactory().build();
}

describe('SortItemLayers, SortNodeLayersByGroups, SortItemsByParent', () => {
  let mediator: MediatorHarness;
  let componentsStore: FComponentsStore;

  beforeEach(() => {
    configureDiTest({
      providers: [
        SortItemLayers,
        SortItemsByParentExecution,
        GetDeepChildrenNodesAndGroupsExecution,
        SortNodeLayersExecution,
      ],
    });

    mediator = createMediatorHarness();
    componentsStore = injectFromDi(FComponentsStore);
  });

  it('should sort nodes and groups by parents', () => {
    const canvas = createCanvas();
    componentsStore.fCanvas = canvas;

    const group1 = createNode('group1', 'group2');
    const group2 = createNode('group2');
    canvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node3 = createNode('node3', 'node2');
    const node1 = createNode('node1', 'group1');
    const node2 = createNode('node2', 'group2');
    canvas
      .fNodesContainer()
      .nativeElement.append(node1.hostElement, node2.hostElement, node3.hostElement);

    registryAddMany(componentsStore.nodes, [group1, group2, node1, node2, node3]);

    mediator.execute<void>(new SortItemLayersRequest());

    expect(canvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node2.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node3.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(2)).toEqual(node1.hostElement);

    expect(canvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group2.hostElement);
    expect(canvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group1.hostElement);
  });

  it('should do nothing if there are nothing to sort', () => {
    const canvas = createCanvas();
    componentsStore.fCanvas = canvas;

    const group1 = createNode('group1');
    const group2 = createNode('group2');
    canvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node1 = createNode('node1');
    const node2 = createNode('node2');
    canvas.fNodesContainer().nativeElement.append(node1.hostElement, node2.hostElement);

    registryAddMany(componentsStore.nodes, [group1, group2, node1, node2]);

    mediator.execute<void>(new SortItemLayersRequest());

    expect(canvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node1.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node2.hostElement);

    expect(canvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group1.hostElement);
    expect(canvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group2.hostElement);
  });

  it('should sort nodes and groups by parents and ignore items with mistakes in parent id', () => {
    const canvas = createCanvas();
    componentsStore.fCanvas = canvas;

    const group1 = createNode('group1', 'node1');
    const group2 = createNode('group2', 'group1');
    canvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node1 = createNode('node1', 'group3');
    const node2 = createNode('node2', 'group4');
    canvas.fNodesContainer().nativeElement.append(node2.hostElement, node1.hostElement);

    registryAddMany(componentsStore.nodes, [group1, group2, node1, node2]);

    mediator.execute<void>(new SortItemLayersRequest());

    expect(canvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node2.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node1.hostElement);

    expect(canvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group1.hostElement);
    expect(canvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group2.hostElement);
  });
});
