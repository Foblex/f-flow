import { UpdateItemAndChildrenLayersRequest } from './update-item-and-children-layers.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import { FNodeBase } from '../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../get-deep-children-nodes-and-groups';
import { MoveFrontElementsBeforeTargetElementRequest } from './move-front-elements-before-target-element';
import { FCanvasBase } from '../../f-canvas';

/**
 * Execution that updates the layers of an item and its children in the FCanvas.
 * It handles different item containers (groups, nodes, connections) and updates their layers accordingly.
 */
@Injectable()
@FExecutionRegister(UpdateItemAndChildrenLayersRequest)
export class UpdateItemAndChildrenLayersExecution implements IExecution<UpdateItemAndChildrenLayersRequest, void> {

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  private get _fCanvas(): FCanvasBase {
    return this._store.fCanvas!;
  }

  private get _fGroupsContainer(): HTMLElement {
    return this._fCanvas.fGroupsContainer().nativeElement;
  }

  private get _fNodesContainer(): HTMLElement {
    return this._fCanvas.fNodesContainer().nativeElement;
  }

  private get _fConnectionsContainer(): HTMLElement {
    return this._fCanvas.fConnectionsContainer().nativeElement;
  }

  public handle(request: UpdateItemAndChildrenLayersRequest): void {

    switch (request.itemContainer) {
      case this._fGroupsContainer:
        this._handleGroup(request);
        break;
      case this._fNodesContainer:
        this._handleNode(request);
        break;
      case this._fConnectionsContainer:
        this._handleConnection(request);
        break;
      default:
        throw new Error('Unknown container');
    }
  }

  private _handleGroup(request: UpdateItemAndChildrenLayersRequest): void {
    const childrenNodesAndGroups = this._getChildrenNodesAndGroups(request.item.fId());
    const childrenGroups = this._getChildrenGroups(childrenNodesAndGroups);
    this._updateLayers(this._fGroupsContainer, request.item.hostElement as HTMLElement, childrenGroups);
    const childrenNodes = this._getChildrenNodes(childrenNodesAndGroups);
    if (childrenNodes.length) {
      this._updateLayers(this._fNodesContainer, childrenNodes[ 0 ], childrenNodes);
    }
  }

  private _handleNode(request: UpdateItemAndChildrenLayersRequest): void {
    const childrenNodesAndGroups = this._getChildrenNodesAndGroups(request.item.fId());
    const childrenNodes = this._getChildrenNodes(childrenNodesAndGroups);
    this._updateLayers(request.itemContainer, request.item.hostElement as HTMLElement, childrenNodes);
  }

  private _handleConnection(request: UpdateItemAndChildrenLayersRequest): void {
    this._updateLayers(request.itemContainer, request.item.hostElement as HTMLElement, []);
  }

  private _updateLayers(itemContainer: HTMLElement, item: HTMLElement, elementsThatShouldBeInFront: HTMLElement[]): void {
    const allElements = Array.from(itemContainer.children) as HTMLElement[];
    const targetIndex = allElements.findIndex((x) => x === item);
    if (this._isAnythingNeedToBeMoved(allElements, targetIndex, elementsThatShouldBeInFront)) {
      this._mediator.execute(
        new MoveFrontElementsBeforeTargetElementRequest(itemContainer, allElements, elementsThatShouldBeInFront, targetIndex),
      );
    }
  }

  private _isAnythingNeedToBeMoved(allElements: HTMLElement[], targetIndex: number, elementsThatShouldBeInFront: HTMLElement[]): boolean {
    for (let i = targetIndex + 1; i < allElements.length; i++) {
      if (!elementsThatShouldBeInFront.includes(allElements[ i ])) {
        return true;
      }
    }

    return false;
  }

  private _getChildrenGroups(elements: HTMLElement[]): HTMLElement[] {
    const allElements = Array.from(this._fGroupsContainer.children) as HTMLElement[];

    return elements.filter((x) => this._fGroupsContainer.contains(x))
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private _getChildrenNodes(elements: HTMLElement[]): HTMLElement[] {
    const allElements = Array.from(this._fNodesContainer.children) as HTMLElement[];

    return elements.filter((x) => this._fNodesContainer.contains(x))
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private _getChildrenNodesAndGroups(fId: string): HTMLElement[] {
    return this._mediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId)).map((x) => x.hostElement);
  }
}
