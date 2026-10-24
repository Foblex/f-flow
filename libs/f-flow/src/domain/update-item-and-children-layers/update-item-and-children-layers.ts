import { UpdateItemAndChildrenLayersRequest } from './update-item-and-children-layers-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '../../_libs/f-mediator';
import { FComponentsStore } from '../../f-storage';
import { GetDeepChildrenNodesAndGroupsRequest } from '../get-deep-children-nodes-and-groups';
import { MoveFrontElementsBeforeTargetElementRequest } from './move-front-elements-before-target-element';
import { FCanvasBase } from '../../f-canvas';
import { fWarnOnce } from '../f-diagnostics';

/**
 * Execution that updates the layers of an item and its children in the FCanvas.
 * It handles different item containers (groups, nodes, connections) and updates their layers accordingly.
 */
@Injectable()
@FExecutionRegister(UpdateItemAndChildrenLayersRequest)
export class UpdateItemAndChildrenLayers implements IExecution<
  UpdateItemAndChildrenLayersRequest,
  void
> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _groupsContainer(): HTMLElement {
    return this._canvas.fGroupsContainer().nativeElement;
  }

  private get _nodesContainer(): HTMLElement {
    return this._canvas.fNodesContainer().nativeElement;
  }

  private get _connectionsContainer(): HTMLElement {
    return this._canvas.fConnectionsContainer().nativeElement;
  }

  public handle(request: UpdateItemAndChildrenLayersRequest): void {
    switch (request.itemContainer) {
      case this._groupsContainer:
        this._handleGroup(request);
        break;
      case this._nodesContainer:
        this._handleNode(request);
        break;
      case this._connectionsContainer:
        this._handleConnection(request);
        break;
      default:
        // FF1012 — the item's parent is not one of the canvas layer containers: the
        // fNode/fGroup sits inside a wrapper component's template, so layer sorting
        // cannot reorder it (the canvas only reorders a container's direct children).
        // Skip the raise instead of breaking the gesture with a throw (issue #337).
        fWarnOnce(
          'FF1012',
          request.item.fId(),
          `"${request.item.fId()}" is not a direct child of a canvas layer container — it is wrapped by <${request.itemContainer?.tagName?.toLowerCase() ?? 'unknown'}>. The canvas positions, drags, and layer-sorts the container's direct children, so place the fNode/fGroup directive on your component's host element in the canvas template instead of inside the component's own template. Layer raising is skipped for this item.`,
        );
    }
  }

  private _handleGroup(request: UpdateItemAndChildrenLayersRequest): void {
    const childrenNodesAndGroups = this._getChildrenNodesAndGroups(request.item.fId());
    const childrenGroups = this._getChildrenGroups(childrenNodesAndGroups);
    this._updateLayers(
      this._groupsContainer,
      request.item.hostElement as HTMLElement,
      childrenGroups,
    );
    const childrenNodes = this._getChildrenNodes(childrenNodesAndGroups);
    if (childrenNodes.length) {
      this._updateLayers(this._nodesContainer, childrenNodes[0], childrenNodes);
    }
  }

  private _handleNode(request: UpdateItemAndChildrenLayersRequest): void {
    const childrenNodesAndGroups = this._getChildrenNodesAndGroups(request.item.fId());
    const childrenNodes = this._getChildrenNodes(childrenNodesAndGroups);
    this._updateLayers(
      request.itemContainer,
      request.item.hostElement as HTMLElement,
      childrenNodes,
    );
  }

  private _handleConnection(request: UpdateItemAndChildrenLayersRequest): void {
    this._updateLayers(request.itemContainer, request.item.hostElement as HTMLElement, []);
  }

  private _updateLayers(
    itemContainer: HTMLElement,
    item: HTMLElement,
    elementsThatShouldBeInFront: HTMLElement[],
  ): void {
    const allElements = Array.from(itemContainer.children) as HTMLElement[];
    const targetIndex = allElements.findIndex((x) => x === item);
    if (this._isAnythingNeedToBeMoved(allElements, targetIndex, elementsThatShouldBeInFront)) {
      this._mediator.execute(
        new MoveFrontElementsBeforeTargetElementRequest(
          itemContainer,
          allElements,
          elementsThatShouldBeInFront,
          targetIndex,
        ),
      );
    }
  }

  private _isAnythingNeedToBeMoved(
    allElements: HTMLElement[],
    targetIndex: number,
    elementsThatShouldBeInFront: HTMLElement[],
  ): boolean {
    for (let i = targetIndex + 1; i < allElements.length; i++) {
      if (!elementsThatShouldBeInFront.includes(allElements[i])) {
        return true;
      }
    }

    return false;
  }

  private _getChildrenGroups(elements: HTMLElement[]): HTMLElement[] {
    const allElements = Array.from(this._groupsContainer.children) as HTMLElement[];

    return elements
      .filter((x) => this._groupsContainer.contains(x))
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private _getChildrenNodes(elements: HTMLElement[]): HTMLElement[] {
    const allElements = Array.from(this._nodesContainer.children) as HTMLElement[];

    return elements
      .filter((x) => this._nodesContainer.contains(x))
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private _getChildrenNodesAndGroups(fId: string): HTMLElement[] {
    return this._mediator
      .execute(new GetDeepChildrenNodesAndGroupsRequest(fId))
      .map((x) => x.hostElement);
  }
}
