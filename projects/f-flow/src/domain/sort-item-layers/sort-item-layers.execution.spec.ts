import { TestBed } from '@angular/core/testing';
import {
  FCanvasBase,
  FComponentsStore,
  FNodeBase, GetDeepChildrenNodesAndGroupsExecution, SortItemLayersExecution, SortItemLayersRequest, SortItemsByParentExecution,
  SortNodeLayersExecution,
} from '@foblex/flow';
import { setupTestModule } from '../test-setup';
import { FMediator } from '@foblex/mediator';
import { signal } from '@angular/core';

function createNode(id: string, element: HTMLElement, parentId?: string): FNodeBase {
  return {
    fId: signal(id).asReadonly(),
    fParentId: signal(parentId).asReadonly(),
    hostElement: element,
  } as FNodeBase;
}

function getFCanvasBase(): FCanvasBase {
  return {
    fGroupsContainer: signal({
      nativeElement: document.createElement('div') as HTMLElement,
    }).asReadonly(),
    fNodesContainer: signal({
      nativeElement: document.createElement('div') as HTMLElement,
    }).asReadonly(),
  } as FCanvasBase;
}

function createElementWithId(id: string): HTMLElement {
  const element = document.createElement('div');
  element.id = id;

  return element;
}

describe('SortItemLayersExecution, SortNodeLayersByGroups, SortItemsByParent', () => {
  let fMediator: FMediator;
  let fComponentsStore: FComponentsStore;

  beforeEach(() => {
    setupTestModule([ SortItemLayersExecution, SortItemsByParentExecution, GetDeepChildrenNodesAndGroupsExecution, SortNodeLayersExecution ]);
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
    fComponentsStore = TestBed.inject(FComponentsStore);
  });

  it('should sort nodes and groups by parents', () => {
    fComponentsStore.fCanvas = getFCanvasBase();

    const group1 = createNode('group1', createElementWithId('group1'), 'group2');
    const group2 = createNode('group2', createElementWithId('group2'));
    fComponentsStore.fCanvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node3 = createNode('node3', createElementWithId('node3'), 'node2');
    const node1 = createNode('node1', createElementWithId('node1'), 'group1');
    const node2 = createNode('node2', createElementWithId('node2'), 'group2');
    fComponentsStore.fCanvas.fNodesContainer().nativeElement.append(node1.hostElement, node2.hostElement, node3.hostElement);

    fComponentsStore.fNodes = [ group1, group2, node1, node2, node3 ];

    fMediator.execute(new SortItemLayersRequest());

    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node2.hostElement);
    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node3.hostElement);
    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(2)).toEqual(node1.hostElement);

    expect(fComponentsStore.fCanvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group2.hostElement);
    expect(fComponentsStore.fCanvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group1.hostElement);
  });

  it('should do nothing if there are nothing to sort', () => {
    fComponentsStore.fCanvas = getFCanvasBase();

    const group1 = createNode('group1', createElementWithId('group1'));
    const group2 = createNode('group2', createElementWithId('group2'));
    fComponentsStore.fCanvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node1 = createNode('node1', createElementWithId('node1'));
    const node2 = createNode('node2', createElementWithId('node2'));
    fComponentsStore.fCanvas.fNodesContainer().nativeElement.append(node1.hostElement, node2.hostElement);

    fComponentsStore.fNodes = [ group1, group2, node1, node2 ];

    fMediator.execute(new SortItemLayersRequest());

    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node1.hostElement);
    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node2.hostElement);

    expect(fComponentsStore.fCanvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group1.hostElement);
    expect(fComponentsStore.fCanvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group2.hostElement);
  });

  it('should sort nodes and groups by parents and ignore items with mistakes in parent id', () => {
    fComponentsStore.fCanvas = getFCanvasBase();

    const group1 = createNode('group1', createElementWithId('group1'), 'node1');
    const group2 = createNode('group2', createElementWithId('group2'), 'group1');
    fComponentsStore.fCanvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node1 = createNode('node1', createElementWithId('node1'), 'group3');
    const node2 = createNode('node2', createElementWithId('node2'), 'group4');
    fComponentsStore.fCanvas.fNodesContainer().nativeElement.append(node2.hostElement, node1.hostElement);

    fComponentsStore.fNodes = [ group1, group2, node1, node2 ];

    fMediator.execute(new SortItemLayersRequest());

    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node2.hostElement);
    expect(fComponentsStore.fCanvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node1.hostElement);

    expect(fComponentsStore.fCanvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group1.hostElement);
    expect(fComponentsStore.fCanvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group2.hostElement);
  });
});
