import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SingleSelectRequest } from './single-select-request';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../domain';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { ISelectable } from '../../mixins';
import { FNodeBase } from '../../f-node';
import { IPointerEvent } from '../../drag-toolkit';
import { FConnectionBase } from '../../f-connection-v2';

/**
 * Implements the functionality for selecting elements in a graphical interface.
 * This class handles both single and multi-selection, updating the selection state
 * of elements and managing related data.
 *
 * Logic flow:
 * 1. **Validate the selection event**:
 *    - The event is considered valid if it occurs within the flow boundaries
 *      and there are no active draggable data operations.
 *
 * 2. **Determine the target element to select**:
 *    - The target element is determined based on the event’s target.
 *      It can be a node, a group of nodes, or a connection.
 *    - If no element is found, the current selection state is cleared.
 *
 * 3. **Update element layers**:
 *    - If an element is found, its visual layer and the layers of its child elements are updated.
 *
 * 4. **Single or multi-selection**:
 *    - If the event meets the criteria for multi-selection (e.g., a modifier key is pressed),
 *      multi-selection logic is applied.
 *    - Otherwise, single-selection logic is used.
 *
 * 5. **Single-selection logic**:
 *    - If the element is not selected and can be selected:
 *      - Clear the selection of all other elements.
 *      - Mark the current element as selected.
 *    - If the element cannot be selected, the current selection is cleared.
 *
 * 6. **Multi-selection logic**:
 *    - If the element is already selected, it is removed from the selection.
 *    - If the element is not selected and can be selected, it is added to the selection.
 *
 * 7. **Manage selection state**:
 *    - Adding or removing an element from the selection triggers the corresponding methods.
 *    - Selection state is tracked in the shared context for future use.
 */

@Injectable()
@FExecutionRegister(SingleSelectRequest)
export class SingleSelect implements IExecution<SingleSelectRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: SingleSelectRequest): void {
    if (!this._isValid(request.event)) {
      return;
    }

    const fItem = this._getItemToSelect(request.event);

    setTimeout(() => this._updateItemAndChildrenLayers(fItem));

    this._isMultiSelect(request) ? this._multiSelect(fItem) : this._singleSelect(fItem);
  }

  private _isValid(event: IPointerEvent): boolean {
    return this._isEventInFlowBounds(event) && this._dragContext.isEmpty();
  }

  private _isEventInFlowBounds(event: IPointerEvent): boolean {
    return this._store.flowHost.contains(event.targetElement);
  }

  private _getItemToSelect(event: IPointerEvent): ISelectable | undefined {
    return this._getNodeOrGroup(event.targetElement) || this._getConnection(event.targetElement);
  }

  private _getNodeOrGroup(targetElement: HTMLElement): FNodeBase | undefined {
    return this._store.nodes.getAll().find((x) => x.isContains(targetElement));
  }

  private _getConnection(element: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this._store.connections.getAll().find((c) => c.isContains(element));
  }

  private _updateItemAndChildrenLayers(fItem?: ISelectable): void {
    if (fItem) {
      this._mediator.execute<void>(
        new UpdateItemAndChildrenLayersRequest(
          fItem,
          fItem.hostElement.parentElement as HTMLElement,
        ),
      );
    }
  }

  private _isMultiSelect({ event, trigger }: SingleSelectRequest): boolean {
    return isValidEventTrigger(event.originalEvent, trigger);
  }

  private _singleSelect(fItem?: ISelectable): void {
    if (fItem) {
      if (this._isItemNotSelectedAndSelectable(fItem)) {
        this._clearSelection();
        this._selectItem(fItem);
      } else if (fItem.fSelectionDisabled()) {
        this._clearSelection();
      }
    } else {
      this._clearSelection();
    }
  }

  private _isItemNotSelectedAndSelectable(item: ISelectable): boolean {
    return !item.isSelected() && !item.fSelectionDisabled();
  }

  private _clearSelection(): void {
    this._dragContext.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
      this._dragContext.markSelectionAsChanged();
    });
    this._dragContext.selectedItems = [];
  }

  private _multiSelect(fItem?: ISelectable): void {
    if (fItem && !fItem.fSelectionDisabled()) {
      fItem.isSelected() ? this._deselectItem(fItem) : this._selectItem(fItem);
    }
  }

  private _deselectItem(fItem: ISelectable): void {
    this._removeItemFromSelectedItems(fItem);
    fItem.unmarkAsSelected();
    this._dragContext.markSelectionAsChanged();
  }

  private _removeItemFromSelectedItems(fItem: ISelectable): void {
    const indexInSelection = this._dragContext.selectedItems.indexOf(fItem);
    if (indexInSelection > -1) {
      this._dragContext.selectedItems.splice(indexInSelection, 1);
    }
  }

  private _selectItem(fItem: ISelectable): void {
    this._dragContext.selectedItems.push(fItem);
    fItem.markAsSelected();
    this._dragContext.markSelectionAsChanged();
  }
}
