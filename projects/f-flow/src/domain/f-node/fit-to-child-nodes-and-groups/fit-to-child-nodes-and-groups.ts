import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FitToChildNodesAndGroupsRequest } from './fit-to-child-nodes-and-groups-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from "../../../f-node";
import { IRect, RectExtensions } from "@foblex/2d";
import { GetNormalizedElementRectRequest } from "../../get-normalized-element-rect";
import { GetNodePaddingRequest } from "../get-node-padding";

@Injectable()
@FExecutionRegister(FitToChildNodesAndGroupsRequest)
export class FitToChildNodesAndGroups
  implements IExecution<FitToChildNodesAndGroupsRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _nodes(): FNodeBase[] {
    return this._store.fNodes;
  }

  public handle({ nodeOrGroup }: FitToChildNodesAndGroupsRequest): void {
    if (nodeOrGroup.fAutoSizeToFitChildren()) {
      const directChildren = this._calculateDirectChildren(nodeOrGroup);
      if (directChildren.length) {
        const currentBounding = this._boundingRect(nodeOrGroup);
        const childrenBounding = this._calculateChildrenBounding(directChildren, this._paddings(nodeOrGroup, currentBounding));

        nodeOrGroup.updatePosition(childrenBounding);
        nodeOrGroup.updateSize(childrenBounding);
        nodeOrGroup.redraw();
      }
    }

    const parent = nodeOrGroup.fParentId();
    if (!parent) {
      return;
    }

    const parentNode = this._nodes.find(x => x.fId() === parent);
    if (!parentNode) {
      return;
    }

    this._mediator.execute<void>(new FitToChildNodesAndGroupsRequest(parentNode));
  }

  private _calculateDirectChildren(nodeOrGroup: FNodeBase): FNodeBase[] {
    return this._nodes.filter(x => x.fParentId() === nodeOrGroup.fId());
  }

  private _unionRect(nodeOrGroups: FNodeBase[]): IRect {
    return RectExtensions.union(
      nodeOrGroups.map((x) => this._boundingRect(x)),
    ) || RectExtensions.initialize();
  }

  private _boundingRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _paddings(nodeOrGroup: FNodeBase, rect: IRect): [number, number, number, number] {
    return this._mediator.execute<[number, number, number, number]>(new GetNodePaddingRequest(nodeOrGroup, rect));
  }

  private _calculateChildrenBounding(directChildren: FNodeBase[], [top, right, bottom, left]: [number, number, number, number]): IRect {
    let childrenBounding = this._unionRect(directChildren);
    childrenBounding = RectExtensions.initialize(
      childrenBounding.x - left,
      childrenBounding.y - top,
      childrenBounding.width + left + right,
      childrenBounding.height + top + bottom,
    );

    return childrenBounding;
  }
}

