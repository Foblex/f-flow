import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FitToChildNodesAndGroupsRequest } from './fit-to-child-nodes-and-groups-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { IRect, RectExtensions } from '@foblex/2d';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
import { GetNodePaddingRequest } from '../get-node-padding';

@Injectable()
@FExecutionRegister(FitToChildNodesAndGroupsRequest)
export class FitToChildNodesAndGroups implements IExecution<FitToChildNodesAndGroupsRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _nodes(): FNodeBase[] {
    return this._store.nodes.getAll();
  }

  public handle({ nodeOrGroup }: FitToChildNodesAndGroupsRequest): void {
    if (nodeOrGroup.fAutoSizeToFitChildren()) {
      const directChildren = this._calculateDirectChildren(nodeOrGroup);
      if (directChildren.length) {
        const currentBounding = this._boundingRect(nodeOrGroup);
        const childrenBounding = this._calculateChildrenBounding(
          directChildren,
          this._paddings(nodeOrGroup, currentBounding),
        );

        // Capture the node's OWN stored rect before applying the fit. The DOM
        // measurement (`currentBounding`) lags a frame behind `redraw`, so the
        // convergence pass (redraw → ResizeObserver → fit again) would still
        // see the old measurement and re-emit the same size — a duplicate.
        const previousRect = this._storedRect(nodeOrGroup);

        nodeOrGroup.updatePosition(childrenBounding);
        nodeOrGroup.updateSize(childrenBounding);
        nodeOrGroup.redraw();

        // Auto-size is a resize like any other: notify `fNodeSizeChange` /
        // `fGroupSizeChange`, but only when the fit actually changed the box,
        // so a settled fit stays silent and can't feed a resize loop.
        if (!previousRect || !this._isSameRect(previousRect, childrenBounding)) {
          nodeOrGroup.sizeChange.emit(childrenBounding);
        }
      }
      // No children: nothing to fit to. The group keeps whatever size it was
      // told to have via `fGroupSize` — the binding (e.g. restored by undo)
      // is the source of truth; the fit must not invent a size here.
    }

    const parent = nodeOrGroup.fParentId();
    if (!parent) {
      return;
    }

    const parentNode = this._nodes.find((x) => x.fId() === parent);
    if (!parentNode) {
      return;
    }

    this._mediator.execute<void>(new FitToChildNodesAndGroupsRequest(parentNode));
  }

  private _calculateDirectChildren(nodeOrGroup: FNodeBase): FNodeBase[] {
    return this._nodes.filter((x) => x.fParentId() === nodeOrGroup.fId());
  }

  private _unionRect(nodeOrGroups: FNodeBase[]): IRect {
    return (
      RectExtensions.union(nodeOrGroups.map((x) => this._boundingRect(x))) ||
      RectExtensions.initialize()
    );
  }

  private _boundingRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(nodeOrGroup.hostElement),
    );
  }

  private _paddings(nodeOrGroup: FNodeBase, rect: IRect): [number, number, number, number] {
    return this._mediator.execute<[number, number, number, number]>(
      new GetNodePaddingRequest(nodeOrGroup, rect),
    );
  }

  private _calculateChildrenBounding(
    directChildren: FNodeBase[],
    [left, top, right, bottom]: [number, number, number, number],
  ): IRect {
    let childrenBounding = this._unionRect(directChildren);
    childrenBounding = RectExtensions.initialize(
      childrenBounding.x - left,
      childrenBounding.y - top,
      childrenBounding.width + left + right,
      childrenBounding.height + top + bottom,
    );

    return childrenBounding;
  }

  private _storedRect(nodeOrGroup: FNodeBase): IRect | null {
    return nodeOrGroup._size
      ? RectExtensions.initialize(
          nodeOrGroup._position.x,
          nodeOrGroup._position.y,
          nodeOrGroup._size.width,
          nodeOrGroup._size.height,
        )
      : null;
  }

  private _isSameRect(a: IRect, b: IRect): boolean {
    return (
      Math.round(a.x) === Math.round(b.x) &&
      Math.round(a.y) === Math.round(b.y) &&
      Math.round(a.width) === Math.round(b.width) &&
      Math.round(a.height) === Math.round(b.height)
    );
  }
}
