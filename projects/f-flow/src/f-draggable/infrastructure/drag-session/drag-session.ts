import { Point } from '@foblex/2d';
import { DragHandlerBase, ISelectable } from '@foblex/flow';
import { Injectable } from '@angular/core';

/**
 * Internal runtime store for a single drag-and-drop session.
 * It is shared across all drag handlers/executions.
 */
@Injectable()
export class DragSession {
  private _selection: ISelectable[] = [];
  private _isSelectionChanged = false;

  private _anchorScale = 1;
  private _anchorPosition = new Point(0, 0);

  private _handlers: DragHandlerBase<unknown>[] = [];

  // Selection
  public get selection(): readonly ISelectable[] {
    return this._selection;
  }

  public setSelection(items: ISelectable[]): void {
    this._selection = items;
  }

  public markSelectionAsChanged(): void {
    this._isSelectionChanged = true;
  }

  public get isSelectionChanged(): boolean {
    return this._isSelectionChanged;
  }

  // Anchor (start state for delta calculations)
  public get anchorScale(): number {
    return this._anchorScale;
  }

  public get anchorPosition(): Point {
    return this._anchorPosition;
  }

  public setAnchor(position: Point, scale: number): void {
    this._anchorPosition = position;
    this._anchorScale = scale;
  }

  // Handlers
  public get handlers(): DragHandlerBase<unknown>[] {
    return this._handlers;
  }

  public addHandlers(items: DragHandlerBase<unknown>[]): void {
    if (!items.length) {
      return;
    }
    this._handlers.push(...items);
  }

  public clearHandlers(): void {
    this._handlers = [];
  }

  public get hasActiveDrag(): boolean {
    return this._handlers.length > 0;
  }

  // Lifecycle
  public reset(): void {
    this._handlers = [];
    this._anchorScale = 1;
    this._anchorPosition = new Point(0, 0);
    // NOTE: selection-change flag is NOT reset here intentionally.
  }
}
