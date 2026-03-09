import { SortItemsByParentRequest } from './sort-items-by-parent-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { BrowserService } from '@foblex/platform';

/**
 * Execution that sorts items by their parent nodes in the FItemsContainer.
 * It retrieves all items within the container, sorts their children based on their current order,
 * and moves them to maintain the correct hierarchy.
 */
@Injectable()
@FExecutionRegister(SortItemsByParentRequest)
export class SortItemsByParent implements IExecution<SortItemsByParentRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);

  public handle({ itemsContainer }: SortItemsByParentRequest): void {
    const elements = Array.from(itemsContainer.children) as HTMLElement[];
    if (elements.length < 2) {
      return;
    }

    const positions = this._buildPositions(elements);

    const items = this._store.nodes.getAll().filter((x) => itemsContainer.contains(x.hostElement));
    if (items.length < 2 || !items.some((item) => !!item.fParentId())) {
      return;
    }

    const childrenByParentId = this._buildChildrenByParentId(items);
    const descendantsCache = new Map<string, FNodeBase[]>();

    for (const item of items) {
      const children = this._getSortedChildrenBeforeParent(
        itemsContainer,
        positions,
        item,
        childrenByParentId,
        descendantsCache,
      );
      if (!children.length) {
        continue;
      }

      this._moveBeforeNextSibling(itemsContainer, children, item.hostElement.nextElementSibling);
    }
  }

  private _buildPositions(elements: HTMLElement[]): Map<HTMLElement, number> {
    const result = new Map<HTMLElement, number>();

    for (let i = 0; i < elements.length; i++) {
      result.set(elements[i], i);
    }

    return result;
  }

  private _getSortedChildrenBeforeParent(
    container: HTMLElement,
    positions: Map<HTMLElement, number>,
    parent: FNodeBase,
    childrenByParentId: Map<string, FNodeBase[]>,
    descendantsCache: Map<string, FNodeBase[]>,
  ): HTMLElement[] {
    const parentPos = positions.get(parent.hostElement);
    if (parentPos === undefined) {
      return [];
    }

    const children = this._getDeepChildren(parent.fId(), childrenByParentId, descendantsCache);
    if (!children.length) {
      return [];
    }

    const result: HTMLElement[] = [];

    for (const child of children) {
      const el = child.hostElement;

      if (!container.contains(el)) {
        continue;
      }

      const pos = positions.get(el);
      if (pos === undefined || pos >= parentPos) {
        continue;
      }

      result.push(el);
    }

    result.sort((a, b) => (positions.get(a) ?? 0) - (positions.get(b) ?? 0));

    return result;
  }

  private _buildChildrenByParentId(nodes: readonly FNodeBase[]): Map<string, FNodeBase[]> {
    const result = new Map<string, FNodeBase[]>();

    for (const node of nodes) {
      const parentId = node.fParentId();
      if (!parentId) {
        continue;
      }

      const children = result.get(parentId) ?? [];
      children.push(node);
      result.set(parentId, children);
    }

    return result;
  }

  private _getDeepChildren(
    parentId: string,
    childrenByParentId: Map<string, FNodeBase[]>,
    descendantsCache: Map<string, FNodeBase[]>,
  ): FNodeBase[] {
    const cached = descendantsCache.get(parentId);
    if (cached) {
      return cached;
    }

    const result: FNodeBase[] = [];
    const stack = [...(childrenByParentId.get(parentId) ?? [])];
    const visited = new Set<string>([parentId]);

    while (stack.length) {
      const node = stack.pop();
      if (!node) {
        continue;
      }
      const nodeId = node.fId();
      if (visited.has(nodeId)) {
        continue;
      }

      visited.add(nodeId);
      result.push(node);

      const children = childrenByParentId.get(nodeId);
      if (children?.length) {
        stack.push(...children);
      }
    }

    descendantsCache.set(parentId, result);

    return result;
  }

  private _moveBeforeNextSibling(
    container: HTMLElement,
    items: HTMLElement[],
    nextSibling: Element | null,
  ): void {
    const fragment = this._browser.document.createDocumentFragment();

    for (const item of items) {
      fragment.appendChild(item);
    }

    container.insertBefore(fragment, nextSibling);
  }
}
