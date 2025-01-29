import { SortItemsByParentRequest } from './sort-items-by-parent.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../get-deep-children-nodes-and-groups';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(SortItemsByParentRequest)
export class SortItemsByParentExecution implements IExecution<SortItemsByParentRequest, void> {

  private fItemsContainer!: HTMLElement;

  private get _fItemElements(): HTMLElement[] {
    return Array.from(this.fItemsContainer.children) as HTMLElement[];
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: SortItemsByParentRequest): void {
    this.fItemsContainer = request.fItemsContainer;
    this._getItemsOfContainer().forEach((fItem: FNodeBase) => {
      this.moveChildrenItems(this._getSortedChildrenItems(fItem), fItem);
    });
  }

  private _getItemsOfContainer(): FNodeBase[] {
    return this.fComponentsStore.fNodes
      .filter((x) => this.fItemsContainer.contains(x.hostElement));
  }

  private _getSortedChildrenItems(
    fItem: FNodeBase,
  ): HTMLElement[] {
    const indexInContainer = this._fItemElements.indexOf(fItem.hostElement);
    return this._getChildrenItems(fItem.fId)
      .filter((child: HTMLElement) => this._fItemElements.indexOf(child) < indexInContainer)
      .sort((a, b) => this._fItemElements.indexOf(a) - this._fItemElements.indexOf(b));
  }

  private _getChildrenItems(fId: string): HTMLElement[] {
    return this.fMediator.send<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId))
      .filter((x) => this.fItemsContainer.contains(x.hostElement)).map((x) => x.hostElement);
  }

  private moveChildrenItems(
    sortedChildrenItems: HTMLElement[],
    parent: FNodeBase,
  ): void {
    let nextSibling = parent.hostElement.nextElementSibling;

    const fragment = this.fBrowser.document.createDocumentFragment();

    sortedChildrenItems.forEach((child: HTMLElement) => {
      fragment.appendChild(child); // Append automatically removes the element from its current position
    });
    this.fItemsContainer.insertBefore(fragment, nextSibling);
  }
}
