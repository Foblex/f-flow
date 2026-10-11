import {
  canvasFactory,
  configureDiTest,
  createMediatorHarness,
  createPureHarness,
  FComponentsStore,
  FNodeBase,
  fSuppressDevWarnings,
  GetDeepChildrenNodesAndGroups,
  injectFromDi,
  MediatorHarness,
  MoveFrontElementsBeforeTargetElement,
  nodeFactory,
  registryAddMany,
  SortItemLayers,
  SortItemLayersRequest,
  SortItemsByParent,
  SortNodeLayers,
  UpdateItemAndChildrenLayers,
  UpdateItemAndChildrenLayersRequest,
} from '@foblex/flow';

const pure = createPureHarness();

function createNode(id: string, parentId?: string): FNodeBase {
  return nodeFactory().id(id).parent(parentId).host(pure.element('div', { id })).build();
}

describe('UpdateItemAndChildrenLayers', () => {
  let mediator: MediatorHarness;
  let componentsStore: FComponentsStore;

  beforeEach(() => {
    configureDiTest({
      providers: [
        UpdateItemAndChildrenLayers,
        SortItemLayers,
        SortItemsByParent,
        SortNodeLayers,
        GetDeepChildrenNodesAndGroups,
        MoveFrontElementsBeforeTargetElement,
      ],
    });

    mediator = createMediatorHarness();
    componentsStore = injectFromDi(FComponentsStore);
  });

  it('should handle group container', () => {
    const canvas = canvasFactory().build();
    componentsStore.fCanvas = canvas;

    const group1 = createNode('group1', 'group2');
    const group2 = createNode('group2');
    canvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node4 = createNode('node4', 'node2');
    const node1 = createNode('node1');
    const node2 = createNode('node2', 'group1');
    const node3 = createNode('node3');

    canvas
      .fNodesContainer()
      .nativeElement.append(
        node4.hostElement,
        node1.hostElement,
        node2.hostElement,
        node3.hostElement,
      );

    registryAddMany(componentsStore.nodes, [group1, group2, node1, node2, node3, node4]);

    mediator.execute<void>(new SortItemLayersRequest());
    mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(group1, canvas.fGroupsContainer().nativeElement),
    );

    expect(canvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group2.hostElement);
    expect(canvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group1.hostElement);

    expect(canvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node1.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node3.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(3)).toEqual(node4.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(2)).toEqual(node2.hostElement);
  });

  it('should handle group container with SortItemLayers', () => {
    const canvas = canvasFactory().build();
    componentsStore.fCanvas = canvas;

    const group1 = createNode('group1', 'group2');
    const group2 = createNode('group2');
    canvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node4 = createNode('node4', 'node2');
    const node1 = createNode('node1');
    const node2 = createNode('node2', 'group1');
    const node3 = createNode('node3');

    canvas
      .fNodesContainer()
      .nativeElement.append(
        node4.hostElement,
        node1.hostElement,
        node2.hostElement,
        node3.hostElement,
      );

    registryAddMany(componentsStore.nodes, [group1, group2, node1, node2, node3, node4]);

    mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(group1, canvas.fGroupsContainer().nativeElement),
    );

    expect(canvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group2.hostElement);
    expect(canvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group1.hostElement);

    expect(canvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node1.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node3.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(2)).toEqual(node4.hostElement);
    expect(canvas.fNodesContainer().nativeElement.children.item(3)).toEqual(node2.hostElement);
  });
});

describe('UpdateItemAndChildrenLayers — FF1012 wrapped item', () => {
  let mediator: MediatorHarness;
  let componentsStore: FComponentsStore;
  let warnSpy: jasmine.Spy;

  beforeEach(() => {
    fSuppressDevWarnings(false);
    warnSpy = spyOn(console, 'warn');

    configureDiTest({ providers: [UpdateItemAndChildrenLayers] });
    mediator = createMediatorHarness();
    componentsStore = injectFromDi(FComponentsStore);
    componentsStore.fCanvas = canvasFactory().build();
  });

  afterEach(() => {
    fSuppressDevWarnings(true);
  });

  function wrappedNodeRequest(id: string): UpdateItemAndChildrenLayersRequest {
    // An fNode placed inside a component template: the wrapper element sits between
    // the layer container and the node host, so the resolved container is unknown.
    const wrapper = document.createElement('app-node');
    const host = pure.element('div', { id });
    wrapper.appendChild(host);

    return new UpdateItemAndChildrenLayersRequest(nodeFactory().id(id).host(host).build(), wrapper);
  }

  it('warns FF1012 and skips the raise instead of throwing (issue #337)', () => {
    expect(() => mediator.execute<void>(wrappedNodeRequest('ff1012-wrapped'))).not.toThrow();

    const messages = warnSpy.calls.allArgs().map((args) => String(args[0]));
    expect(
      messages.some(
        (m) => m.includes('FF1012') && m.includes('ff1012-wrapped') && m.includes('app-node'),
      ),
    ).toBe(true);
  });

  it('warns once per item, not once per gesture', () => {
    const request = wrappedNodeRequest('ff1012-once');

    mediator.execute<void>(request);
    mediator.execute<void>(request);

    const messages = warnSpy.calls
      .allArgs()
      .map((args) => String(args[0]))
      .filter((m) => m.includes('FF1012') && m.includes('ff1012-once'));
    expect(messages.length).toBe(1);
  });
});
