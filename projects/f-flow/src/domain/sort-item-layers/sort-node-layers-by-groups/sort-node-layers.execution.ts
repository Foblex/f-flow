import { SortNodeLayersRequest } from './sort-node-layers.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../get-deep-children-nodes-and-groups';
import { BrowserService } from '@foblex/platform';
import { FCanvasBase } from '../../../f-canvas';

@Injectable()
@FExecutionRegister(SortNodeLayersRequest)
export class SortNodeLayersExecution implements IExecution<SortNodeLayersRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fBrowser = inject(BrowserService);

  private get _fCanvas(): FCanvasBase {
    return this._fComponentsStore.fCanvas!;
  }

  private get _fGroupsContainer(): HTMLElement {
    return this._fCanvas.fGroupsContainer().nativeElement;
  }

  private get _fNodesContainer(): HTMLElement {
    return this._fCanvas.fNodesContainer().nativeElement;
  }

  private get _fNodeElements(): HTMLElement[] {
    return Array.from(this._fNodesContainer.children) as HTMLElement[];
  }

  public handle(request: SortNodeLayersRequest): void {
    this._getGroups().forEach((parent: FNodeBase) => {
      this._moveChildrenNodes(this._getSortedChildrenNodes(parent));
    });
  }

  private _getGroups(): FNodeBase[] {
    return this._fComponentsStore.fNodes
      .filter((x) => this._fGroupsContainer.contains(x.hostElement));
  }

  private _getSortedChildrenNodes(
    parent: FNodeBase,
  ): HTMLElement[] {
    const allElements = this._fNodeElements;
    return this._getChildrenNodes(parent.fId)
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private _getChildrenNodes(fId: string): HTMLElement[] {
    return this._fMediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId))
      .filter((x) => this._fNodesContainer.contains(x.hostElement)).map((x) => x.hostElement);
  }

  private _moveChildrenNodes(
    sortedChildrenGroups: HTMLElement[],
  ): void {
    const fragment = this._fBrowser.document.createDocumentFragment();
    sortedChildrenGroups.forEach((childGroup: HTMLElement) => {
      fragment.appendChild(childGroup); // Append automatically removes the element from its current position
    });
    this._fNodesContainer.appendChild(fragment);
  }
}
