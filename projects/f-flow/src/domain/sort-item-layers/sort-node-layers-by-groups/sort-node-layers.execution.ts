import { SortNodeLayersRequest } from './sort-node-layers.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../get-deep-children-nodes-and-groups';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(SortNodeLayersRequest)
export class SortNodeLayersExecution implements IExecution<SortNodeLayersRequest, void> {

  private get fGroupsContainer(): HTMLElement {
    return this.fComponentsStore.fCanvas!.fGroupsContainer.nativeElement;
  }

  private get fNodesContainer(): HTMLElement {
    return this.fComponentsStore.fCanvas!.fNodesContainer.nativeElement;
  }

  private get fNodesContainerElements(): HTMLElement[] {
    return Array.from(this.fNodesContainer.children) as HTMLElement[];
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
    private fBrowser: BrowserService,
  ) {
  }

  public handle(request: SortNodeLayersRequest): void {
    this.getGroups().forEach((parent: FNodeBase) => {
      this.moveChildrenNodes(this.getSortedChildrenNodes(parent));
    });
  }

  private getGroups(): FNodeBase[] {
    return this.fComponentsStore.fNodes.filter((x) => this.fGroupsContainer.contains(x.hostElement));
  }

  private getSortedChildrenNodes(
    parent: FNodeBase,
  ): HTMLElement[] {
    const allElements = this.fNodesContainerElements;
    return this.getChildrenNodes(parent.fId)
      .sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }

  private getChildrenNodes(fId: string): HTMLElement[] {
    return this.fMediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId))
      .filter((x) => this.fNodesContainer.contains(x.hostElement)).map((x) => x.hostElement);
  }

  private moveChildrenNodes(
    sortedChildrenGroups: HTMLElement[],
  ): void {
    const fragment = this.fBrowser.document.createDocumentFragment();
    sortedChildrenGroups.forEach((childGroup: HTMLElement) => {
      fragment.appendChild(childGroup); // Append automatically removes the element from its current position
    });
    this.fNodesContainer.appendChild(fragment);
  }
}
