import { SortNodeLayersRequest } from './sort-node-layers-request';
import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../_libs/f-mediator';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../get-deep-children-nodes-and-groups';
import { BrowserService } from '../../../_libs/f-platform';
import { FCanvasBase } from '../../../f-canvas';

/**
 * Execution that sorts node layers by their parent nodes in the FCanvas.
 * It retrieves all groups, sorts their children nodes based on their current order,
 * and moves them to maintain the correct hierarchy.
 */
@Injectable()
export class SortNodeLayers implements IExecution<SortNodeLayersRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _groupsContainer(): HTMLElement {
    return this._canvas.fGroupsContainer().nativeElement;
  }

  private get _nodesContainer(): HTMLElement {
    return this._canvas.fNodesContainer().nativeElement;
  }

  private get _fNodeElements(): HTMLElement[] {
    return Array.from(this._nodesContainer.children) as HTMLElement[];
  }

  public handle(_: SortNodeLayersRequest): void {
    this._getGroups().forEach((parent: FNodeBase) => {
      this._moveChildrenNodes(this._getSortedChildrenNodes(parent));
    });
  }

  // each move appends the group's children to the container tail; when they already sit
  // there in that exact order the append is a pure no-op that still resets CSS
  // transitions and forces layout, so the steady state (every pass after the first one)
  // must skip the DOM entirely
  private _isAlreadyContainerTail(elements: HTMLElement[]): boolean {
    let cursor: Element | null = this._nodesContainer.lastElementChild;

    for (let i = elements.length - 1; i >= 0; i--) {
      if (cursor !== elements[i]) {
        return false;
      }
      cursor = cursor.previousElementSibling;
    }

    return true;
  }

  private _getGroups(): FNodeBase[] {
    return this._store.nodes.getAll().filter((x) => this._groupsContainer.contains(x.hostElement));
  }

  private _getSortedChildrenNodes(parent: FNodeBase): HTMLElement[] {
    const allElements = this._fNodeElements;

    return this._getChildrenNodes(parent.fId()).sort(
      (a, b) => allElements.indexOf(a) - allElements.indexOf(b),
    );
  }

  private _getChildrenNodes(fId: string): HTMLElement[] {
    return this._mediator
      .execute(new GetDeepChildrenNodesAndGroupsRequest(fId))
      .filter((x) => this._nodesContainer.contains(x.hostElement))
      .map((x) => x.hostElement);
  }

  private _moveChildrenNodes(sortedChildrenGroups: HTMLElement[]): void {
    if (!sortedChildrenGroups.length || this._isAlreadyContainerTail(sortedChildrenGroups)) {
      return;
    }

    const fragment = this._browser.document.createDocumentFragment();
    sortedChildrenGroups.forEach((childGroup: HTMLElement) => {
      fragment.appendChild(childGroup);
    });
    this._nodesContainer.appendChild(fragment);
  }
}
