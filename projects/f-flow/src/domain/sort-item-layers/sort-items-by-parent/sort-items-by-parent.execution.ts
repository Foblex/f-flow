import { SortItemsByParentRequest } from './sort-items-by-parent.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../get-deep-children-nodes-and-groups';
import { BrowserService } from '@foblex/platform';

/**
 * Execution that sorts items by their parent nodes in the FItemsContainer.
 * It retrieves all items within the container, sorts their children based on their current order,
 * and moves them to maintain the correct hierarchy.
 */
@Injectable()
@FExecutionRegister(SortItemsByParentRequest)
export class SortItemsByParentExecution implements IExecution<SortItemsByParentRequest, void> {

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);

  private _fItemsContainer!: HTMLElement;

  private get _fItemElements(): HTMLElement[] {
    return Array.from(this._fItemsContainer.children) as HTMLElement[];
  }

  public handle(request: SortItemsByParentRequest): void {
    this._fItemsContainer = request.fItemsContainer;
    this._getItemsOfContainer().forEach((fItem: FNodeBase) => {
      this._moveChildrenItems(this._getSortedChildrenItems(fItem), fItem);
    });
  }

  private _getItemsOfContainer(): FNodeBase[] {
    return this._store.fNodes
      .filter((x) => this._fItemsContainer.contains(x.hostElement));
  }

  private _getSortedChildrenItems(
    fItem: FNodeBase,
  ): HTMLElement[] {
    const indexInContainer = this._fItemElements.indexOf(fItem.hostElement);

    return this._getChildrenItems(fItem.fId())
      .filter((child: HTMLElement) => this._fItemElements.indexOf(child) < indexInContainer)
      .sort((a, b) => this._fItemElements.indexOf(a) - this._fItemElements.indexOf(b));
  }

  private _getChildrenItems(fId: string): HTMLElement[] {
    return this._mediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId))
      .filter((x) => this._fItemsContainer.contains(x.hostElement)).map((x) => x.hostElement);
  }

  private _moveChildrenItems(
    sortedChildrenItems: HTMLElement[],
    parent: FNodeBase,
  ): void {
    const nextSibling = parent.hostElement.nextElementSibling;

    const fragment = this._browser.document.createDocumentFragment();

    sortedChildrenItems.forEach((child: HTMLElement) => {
      fragment.appendChild(child); // Append automatically removes the element from its current position
    });
    this._fItemsContainer.insertBefore(fragment, nextSibling);
  }
}
