import { UpdateItemAndChildrenLayersRequest } from './update-item-and-children-layers.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import { FNodeBase } from '../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../get-deep-children-nodes-and-groups';
import { MoveFrontElementsBeforeTargetElementRequest } from './move-front-elements-before-target-element';

@Injectable()
@FExecutionRegister(UpdateItemAndChildrenLayersRequest)
export class UpdateItemAndChildrenLayersExecution implements IExecution<UpdateItemAndChildrenLayersRequest, void> {

  private get fGroupsContainer(): HTMLElement {
    return this.fComponentsStore.fCanvas!.fGroupsContainer.nativeElement;
  }

  private get fNodesContainer(): HTMLElement {
    return this.fComponentsStore.fCanvas!.fNodesContainer.nativeElement;
  }

  private get fConnectionsContainer(): HTMLElement {
    return this.fComponentsStore.fCanvas!.fConnectionsContainer.nativeElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(request: UpdateItemAndChildrenLayersRequest): void {

    switch (request.itemContainer) {
      case this.fGroupsContainer:
        this.handleGroup(request);
        break;
      case this.fNodesContainer:
        this.handleNode(request);
        break;
      case this.fConnectionsContainer:
        this.handleConnection(request);
        break;
      default:
        throw new Error('Unknown container');
    }
  }

  private handleGroup(request: UpdateItemAndChildrenLayersRequest): void {
    const childrenNodesAndGroups = this.getChildrenNodesAndGroups(request.item.fId);
    const childrenGroups = this.getChildrenGroups(childrenNodesAndGroups);
    this.updateLayers(this.fGroupsContainer, request.item.hostElement as HTMLElement, childrenGroups);
    const childrenNodes = this.getChildrenNodes(childrenNodesAndGroups);
    if (childrenNodes.length) {
      this.updateLayers(this.fNodesContainer, childrenNodes[ 0 ], childrenNodes);
    }
  }

  private handleNode(request: UpdateItemAndChildrenLayersRequest): void {
    const childrenNodesAndGroups = this.getChildrenNodesAndGroups(request.item.fId);
    const childrenNodes = this.getChildrenNodes(childrenNodesAndGroups);
    this.updateLayers(request.itemContainer, request.item.hostElement as HTMLElement, childrenNodes);
  }

  private handleConnection(request: UpdateItemAndChildrenLayersRequest): void {
    this.updateLayers(request.itemContainer, request.item.hostElement as HTMLElement, []);
  }

  private updateLayers(itemContainer: HTMLElement, item: HTMLElement, elementsThatShouldBeInFront: HTMLElement[]): void {
    const allElements = Array.from(itemContainer.children) as HTMLElement[];
    const targetIndex = allElements.findIndex((x) => x === item);
    if (this.isAnythingNeedToBeMoved(allElements, targetIndex, elementsThatShouldBeInFront)) {
      this.fMediator.send(
        new MoveFrontElementsBeforeTargetElementRequest(itemContainer, allElements, elementsThatShouldBeInFront, targetIndex)
      );
    }
  }

  private isAnythingNeedToBeMoved(allElements: HTMLElement[], targetIndex: number, elementsThatShouldBeInFront: HTMLElement[]): boolean {
    for (let i = targetIndex + 1; i < allElements.length; i++) {
      if (!elementsThatShouldBeInFront.includes(allElements[ i ])) {
        return true;
      }
    }
    return false;
  }

  private getChildrenGroups(elements: HTMLElement[]): HTMLElement[] {
    const allElements = Array.from(this.fGroupsContainer.children) as HTMLElement[];
    return elements.filter((x) => this.fGroupsContainer.contains(x))
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private getChildrenNodes(elements: HTMLElement[]): HTMLElement[] {
    const allElements = Array.from(this.fNodesContainer.children) as HTMLElement[];
    return elements.filter((x) => this.fNodesContainer.contains(x))
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private getChildrenNodesAndGroups(fId: string): HTMLElement[] {
    return this.fMediator.send<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId)).map((x) => x.hostElement);
  }
}
