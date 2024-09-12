import { SortItemsByParentRequest } from './sort-items-by-parent.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../get-deep-children-nodes-and-groups';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(SortItemsByParentRequest)
export class SortItemsByParentExecution implements IExecution<SortItemsByParentRequest, void> {

  private fItemsContainer!: HTMLElement;

  private get fItemsFromContainer(): HTMLElement[] {
    return Array.from(this.fItemsContainer.children) as HTMLElement[];
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: SortItemsByParentRequest): void {
    this.fItemsContainer = request.fItemsContainer;
    this.getItems().forEach((parent: FNodeBase) => {
      this.moveChildrenItems(this.getSortedChildrenItems(parent), parent);
    });
  }

  private getItems(): FNodeBase[] {
    return this.fComponentsStore.fNodes.filter((x) => this.fItemsContainer.contains(x.hostElement));
  }

  private getSortedChildrenItems(
    parent: FNodeBase,
  ): HTMLElement[] {
    const allElements = this.fItemsFromContainer;
    const parentIndex = allElements.indexOf(parent.hostElement);
    return this.getChildrenGroups(parent.fId)
      .filter((child: HTMLElement) => allElements.indexOf(child) < parentIndex)
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private getChildrenGroups(fId: string): HTMLElement[] {
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
