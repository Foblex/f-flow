import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SingleSelectRequest } from './single-select.request';
import { UpdateItemAndChildrenLayersRequest } from '../../domain';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { FConnectionBase } from '../../f-connection';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { EOperationSystem, PlatformService } from '@foblex/platform';
import { ICanChangeSelection } from '../../mixins';

@Injectable()
@FExecutionRegister(SingleSelectRequest)
export class SingleSelectExecution implements IExecution<SingleSelectRequest, void> {

  constructor(
    private fPlatform: PlatformService,
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator
  ) {
  }

  public handle(request: SingleSelectRequest): void {
    const { event } = request;

    const item = this.getSelectableItem(event);
    if (item) {
      this.fMediator.send<void>(new UpdateItemAndChildrenLayersRequest(item, item.hostElement.parentElement!));
    }

    this.isMultiselectEnabled(event) ? this.multiSelect(item) : this.singleSelect(item);
  }

  private getSelectableItem(event: IPointerEvent): ICanChangeSelection | undefined {
    return this.fComponentsStore.findNode(event.targetElement) || this.getConnectionHandler(event.targetElement);
  }

  private getConnectionHandler(element: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this.fComponentsStore.fConnections.find(c => c.isContains(element) || c.fConnectionCenter?.nativeElement?.contains(element));
  }

  private isMultiselectEnabled(event: IPointerEvent): boolean {
    return this.isCommandButton(this.fPlatform.getOS()!, event.originalEvent) ||
      this.isShiftPressed(event.originalEvent);
  }

  private isShiftPressed(event: { shiftKey: boolean }): boolean {
    return event.shiftKey;
  }

  private isCommandButton(platform: EOperationSystem, event: { metaKey: boolean, ctrlKey: boolean }): boolean {
    return platform === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  }

  private singleSelect(item: ICanChangeSelection | undefined): void {
    if (item) {
      if (!item.isSelected() && !item.fSelectionDisabled) {
        this.clearSelection();
        this.selectItem(item);
      }
    } else {
      this.clearSelection();
    }
  }

  private multiSelect(item: ICanChangeSelection | undefined): void {
    if (item && !item.fSelectionDisabled) {
      item.isSelected() ? this.deselectItem(item) : this.selectItem(item);
    }
  }

  private deselectItem(item: ICanChangeSelection): void {
    const index = this.fDraggableDataContext.selectedItems.indexOf(item);
    if (index > -1) {
      this.fDraggableDataContext.selectedItems.splice(index, 1);
    }
    item.deselect();
    this.fDraggableDataContext.markSelectionAsChanged();
  }

  private selectItem(item: ICanChangeSelection): void {
    this.fDraggableDataContext.selectedItems.push(item);
    item.select();
    this.fDraggableDataContext.markSelectionAsChanged();
  }

  private clearSelection(): void {
    this.fDraggableDataContext.selectedItems.forEach((x) => {
      x.deselect();
      this.fDraggableDataContext.markSelectionAsChanged();
    });
    this.fDraggableDataContext.selectedItems = [];
  }
}
