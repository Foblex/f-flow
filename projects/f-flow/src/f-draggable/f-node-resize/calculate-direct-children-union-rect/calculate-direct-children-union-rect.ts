import { inject, Injectable } from '@angular/core';
import { CalculateDirectChildrenUnionRectRequest } from './calculate-direct-children-union-rect-request';
import { IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { FComponentsStore } from "../../../f-storage";

@Injectable()
@FExecutionRegister(CalculateDirectChildrenUnionRectRequest)
export class CalculateDirectChildrenUnionRect
  implements IExecution<CalculateDirectChildrenUnionRectRequest, IRect | null> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _allNodesAndGroups(): FNodeBase[] {
    return this._store.fNodes;
  }

  public handle({ nodeOrGroup, paddings }: CalculateDirectChildrenUnionRectRequest): IRect | null {
    const childNodeRect = RectExtensions.union(
      this._calculateDirectChildren(nodeOrGroup.fId()).map((x) => this._normalizeRect(x)),
    );

    return childNodeRect ?
      this._concatRectWithParentPadding(childNodeRect, paddings) : null;
  }

  private _calculateDirectChildren(nodeOrGroupId: string): FNodeBase[] {
    return this._allNodesAndGroups.filter((x) => x.fParentId() === nodeOrGroupId);
  }

  private _normalizeRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _concatRectWithParentPadding(rect: IRect, padding: [number, number, number, number]): IRect {
    return RectExtensions.initialize(
      rect.x - padding[0],
      rect.y - padding[1],
      rect.width + padding[0] + padding[2],
      rect.height + +padding[1] + padding[3],
    );
  }
}
