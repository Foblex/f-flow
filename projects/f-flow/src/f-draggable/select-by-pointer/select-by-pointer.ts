import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SelectByPointerRequest } from './select-by-pointer-request';
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
@FExecutionRegister(SelectByPointerRequest)
export class SelectByPointer implements IExecution<SelectByPointerRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle({ event, trigger }: SelectByPointerRequest): void {
    if (!this._isSelectionAllowed(event)) {
      return;
    }

    const item = this._resolveSelectable(event.targetElement);
    // if (!item) {
    //   this._clearSelection();
    //
    //   return;
    // }

    this._deferRaiseLayerFor(item);

    const isMultiSelect = isValidEventTrigger(event.originalEvent, trigger);
    isMultiSelect ? this._applyToggleSelect(item) : this._applySingleSelect(item);
  }

  private _isSelectionAllowed(event: IPointerEvent): boolean {
    return this._store.flowHost.contains(event.targetElement) && this._dragSession.isEmpty();
  }

  private _resolveSelectable(target: HTMLElement): ISelectable | undefined {
    return this._findNodeOrGroupAt(target) ?? this._findConnectionAt(target);
  }

  private _findNodeOrGroupAt(target: HTMLElement): FNodeBase | undefined {
    return this._store.nodes.getAll().find((x) => x.isContains(target));
  }

  private _findConnectionAt(target: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this._store.connections.getAll().find((x) => x.isContains(target));
  }

  private _deferRaiseLayerFor(item?: ISelectable): void {
    if (!item) {
      return;
    }

    queueMicrotask(() => {
      this._mediator.execute<void>(
        new UpdateItemAndChildrenLayersRequest(item, item.hostElement.parentElement as HTMLElement),
      );
    });
  }

  private _applySingleSelect(item?: ISelectable): void {
    if (!item || item.fSelectionDisabled()) {
      this._clearSelection();

      return;
    }

    if (!item.isSelected()) {
      this._clearSelection();
      this._select(item);
    }
  }

  private _applyToggleSelect(item?: ISelectable): void {
    if (!item || item.fSelectionDisabled()) {
      return;
    }

    item.isSelected() ? this._deselect(item) : this._select(item);
  }

  private _clearSelection(): void {
    if (!this._dragSession.selectedItems.length) {
      return;
    }

    for (const item of this._dragSession.selectedItems) {
      item.unmarkAsSelected();
    }

    this._dragSession.selectedItems = [];
    this._dragSession.markSelectionAsChanged();
  }

  private _select(item: ISelectable): void {
    this._dragSession.selectedItems.push(item);
    item.markAsSelected();
    this._dragSession.markSelectionAsChanged();
  }

  private _deselect(item: ISelectable): void {
    const idx = this._dragSession.selectedItems.indexOf(item);
    if (idx >= 0) {
      this._dragSession.selectedItems.splice(idx, 1);
    }

    item.unmarkAsSelected();
    this._dragSession.markSelectionAsChanged();
  }
}
