import { TestBed } from '@angular/core/testing';
import { setupTestModule } from '../test-setup';
import { FMediator } from '@foblex/mediator';
import { FNodeBase } from '../../f-node';
import { FCanvasBase } from '@foblex/flow';
import { FComponentsStore } from '@foblex/flow';
import { UpdateItemAndChildrenLayersExecution } from '@foblex/flow';
import {
  SortItemLayersExecution,
  SortItemLayersRequest,
  SortItemsByParentExecution,
  SortNodeLayersExecution,
} from '@foblex/flow';
import { GetDeepChildrenNodesAndGroupsExecution } from '@foblex/flow';
import { MoveFrontElementsBeforeTargetElementExecution } from '@foblex/flow';
import { UpdateItemAndChildrenLayersRequest } from '@foblex/flow';
import { signal } from '@angular/core';

function createElement(id: string): HTMLElement {
  const element = document.createElement('div');
  element.id = id;

  return element;
}

function createNode(id: string, element: HTMLElement, parentId?: string): FNodeBase {
  return {
    fId: signal(id).asReadonly(),
    fParentId: signal(parentId).asReadonly(),
    hostElement: element,
  } as FNodeBase;
}

function createCanvas(): FCanvasBase {
  return {
    fGroupsContainer: signal({
      nativeElement: document.createElement('div') as HTMLElement,
    }).asReadonly(),
    fNodesContainer: signal({
      nativeElement: document.createElement('div') as HTMLElement,
    }).asReadonly(),
    fConnectionsContainer: signal({
      nativeElement: document.createElement('div') as HTMLElement,
    }).asReadonly(),
  } as FCanvasBase;
}

describe('UpdateItemAndChildrenLayersExecution', () => {
  let fMediator: FMediator;
  let fComponentsStore: FComponentsStore;

  beforeEach(() => {
    setupTestModule([ UpdateItemAndChildrenLayersExecution, SortItemLayersExecution, SortItemsByParentExecution, SortNodeLayersExecution, GetDeepChildrenNodesAndGroupsExecution, MoveFrontElementsBeforeTargetElementExecution]);
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
    fComponentsStore = TestBed.inject(FComponentsStore);
  });

  it('should handle group container', () => {
    const fCanvas = createCanvas();
    fComponentsStore.fCanvas = fCanvas;

    const group1 = createNode('group1', createElement('group1'), 'group2');
    const group2 = createNode('group2', createElement('group2'));
    fCanvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node4 = createNode('node4', createElement('node4'), 'node2');
    const node1 = createNode('node1', createElement('node1'));
    const node2 = createNode('node2', createElement('node2'), 'group1');
    const node3 = createNode('node3', createElement('node3'));

    fCanvas.fNodesContainer().nativeElement.append(node4.hostElement, node1.hostElement, node2.hostElement, node3.hostElement);

    fComponentsStore.fNodes = [ group1, group2, node1, node2, node3, node4 ];
    fMediator.execute(new SortItemLayersRequest());
    fMediator.execute(new UpdateItemAndChildrenLayersRequest(group1, fCanvas.fGroupsContainer().nativeElement));

    expect(fCanvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group2.hostElement);
    expect(fCanvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group1.hostElement);

    expect(fCanvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node1.hostElement);
    expect(fCanvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node3.hostElement);
    expect(fCanvas.fNodesContainer().nativeElement.children.item(3)).toEqual(node4.hostElement);
    expect(fCanvas.fNodesContainer().nativeElement.children.item(2)).toEqual(node2.hostElement);
  });

  it('should handle group container with SortItemLayers', () => {
    const fCanvas = createCanvas();
    fComponentsStore.fCanvas = fCanvas;

    const group1 = createNode('group1', createElement('group1'), 'group2');
    const group2 = createNode('group2', createElement('group2'));
    fCanvas.fGroupsContainer().nativeElement.append(group1.hostElement, group2.hostElement);

    const node4 = createNode('node4', createElement('node4'), 'node2');
    const node1 = createNode('node1', createElement('node1'));
    const node2 = createNode('node2', createElement('node2'), 'group1');
    const node3 = createNode('node3', createElement('node3'));

    fCanvas.fNodesContainer().nativeElement.append(node4.hostElement, node1.hostElement, node2.hostElement, node3.hostElement);

    fComponentsStore.fNodes = [ group1, group2, node1, node2, node3, node4 ];

    fMediator.execute(new UpdateItemAndChildrenLayersRequest(group1, fCanvas.fGroupsContainer().nativeElement));

    expect(fCanvas.fGroupsContainer().nativeElement.children.item(0)).toEqual(group2.hostElement);
    expect(fCanvas.fGroupsContainer().nativeElement.children.item(1)).toEqual(group1.hostElement);

    expect(fCanvas.fNodesContainer().nativeElement.children.item(0)).toEqual(node1.hostElement);
    expect(fCanvas.fNodesContainer().nativeElement.children.item(1)).toEqual(node3.hostElement);
    expect(fCanvas.fNodesContainer().nativeElement.children.item(2)).toEqual(node4.hostElement); // node4 is here because we need call SortItemLayers on test Init
    expect(fCanvas.fNodesContainer().nativeElement.children.item(3)).toEqual(node2.hostElement);
  });
});
