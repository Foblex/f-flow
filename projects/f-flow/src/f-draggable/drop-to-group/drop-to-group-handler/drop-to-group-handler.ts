import { inject, Injectable } from '@angular/core';
import { IPoint, ITransformModel, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { DragHandlerBase } from '../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { INodeWithRect } from '../../domain';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { F_CSS_CLASS } from '../../../domain';

const DEBOUNCE_MS = 1;

@Injectable()
export class DropToGroupHandler extends DragHandlerBase<unknown> {
  /** Legacy identifier (external compatibility). */
  protected readonly type = 'move-node-to-parent';
  /** New identifier. */
  protected readonly kind = 'assign-to-container';

  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private _candidateGroups: INodeWithRect[] = [];

  private _pointerDownInFlow = PointExtensions.initialize();
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private _activeTarget: INodeWithRect | null = null;

  /** Read-only access for finalize stage. */
  public get activeTarget(): INodeWithRect | null {
    return this._activeTarget;
  }

  public initialize(candidateGroups: INodeWithRect[]) {
    this._pointerDownInFlow = this._dragSession.onPointerDownPosition;
    this._candidateGroups = candidateGroups;
  }

  public override prepareDragSequence(): void {
    for (const { node } of this._candidateGroups) {
      node.hostElement.classList.add(F_CSS_CLASS.GROUPING.DROP_ACTIVE);
    }
  }

  public override onPointerMove(difference: IPoint): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => this._updateActiveTarget(difference), DEBOUNCE_MS);
  }

  public override onPointerUp(): void {
    this._clearActiveTarget();

    for (const { node } of this._candidateGroups) {
      node.hostElement.classList.remove(F_CSS_CLASS.GROUPING.DROP_ACTIVE);
    }

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }

  private _updateActiveTarget(difference: IPoint): void {
    const pointerInCanvas = this._getPointerInCanvas(difference);
    const next = this._findTargetUnderPointer(pointerInCanvas);

    if (next) {
      this._setActiveTarget(next);
    } else {
      this._clearActiveTarget();
    }
  }

  private _getPointerInCanvas(difference: IPoint): IPoint {
    return Point.fromPoint(this._pointerDownInFlow).add(difference).mult(this._transform.scale);
  }

  private _findTargetUnderPointer(pointer: IPoint): INodeWithRect | undefined {
    return this._candidateGroups.find((x) => RectExtensions.isIncludePoint(x.rect, pointer));
  }

  private _setActiveTarget(target: INodeWithRect): void {
    if (this._activeTarget?.node === target.node) {
      return;
    }

    this._clearActiveTarget();
    this._activeTarget = target;
    target.node.setClass(F_CSS_CLASS.GROUPING.OVER_BOUNDARY);
  }

  private _clearActiveTarget(): void {
    this._activeTarget?.node.removeClass(F_CSS_CLASS.GROUPING.OVER_BOUNDARY);
    this._activeTarget = null;
  }
}
