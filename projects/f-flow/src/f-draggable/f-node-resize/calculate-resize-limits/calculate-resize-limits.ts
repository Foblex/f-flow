import { inject, Injectable } from '@angular/core';
import { CalculateResizeLimitsRequest } from './calculate-resize-limits-request';
import { IRect, SizeExtensions } from '@foblex/2d';
import { IResizeConstraint, IResizeLimit, IResizeLimits } from '../constraint';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateDirectChildrenUnionRectRequest } from '../calculate-direct-children-union-rect';
import { FNodeBase } from '../../../f-node';
import { GetNodePaddingRequest, GetParentNodesRequest } from '../../../domain';
import {
  GetNodeBoundingIncludePaddingsRequest,
  GetNodeBoundingIncludePaddingsResponse,
} from "../../f-node-move";

@Injectable()
@FExecutionRegister(CalculateResizeLimitsRequest)
export class CalculateResizeLimits
  implements IExecution<CalculateResizeLimitsRequest, IResizeConstraint> {

  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup, rect }: CalculateResizeLimitsRequest): IResizeConstraint {
    const parents = this._getParentsChain(nodeOrGroup);

    const paddings = this._calculateNodePaddings(nodeOrGroup, rect);

    return {
      limits: this._buildSoftHardLimits(parents),
      childrenBounds: this._getNormalizedChildrenBounds(nodeOrGroup, paddings),
      minimumSize: SizeExtensions.initialize(paddings[0] + paddings[2], paddings[1] + paddings[3]),
    }
  }

  private _calculateNodePaddings(nodeOrGroup: FNodeBase, rect: IRect): [number, number, number, number] {
    return this._mediator.execute<[number, number, number, number]>(new GetNodePaddingRequest(nodeOrGroup, rect));
  }

  private _getNormalizedChildrenBounds(nodeOrGroup: FNodeBase, paddings: [number, number, number, number]): IRect | null {
    return this._mediator.execute<IRect | null>(new CalculateDirectChildrenUnionRectRequest(nodeOrGroup, paddings));
  }

  private _getParentsChain(nodeOrGroup: FNodeBase): FNodeBase[] {
    return this._mediator.execute<FNodeBase[]>(new GetParentNodesRequest(nodeOrGroup)) ?? [];
  }

  private _buildSoftHardLimits(parents: FNodeBase[]): IResizeLimits {
    const soft: IResizeLimit[] = [];
    let hard: IResizeLimit | undefined;

    let childrenPaddings: [number, number, number, number] = [0, 0, 0, 0];

    for (const parent of parents) {
      const parentInfo = this._getParentInfo(parent, childrenPaddings);
      childrenPaddings = parentInfo.paddings;

      if (this._isAutoExpand(parent)) {
        soft.push(this._makeLimit(parent, parentInfo));
      } else {
        hard = this._makeLimit(parent, parentInfo);
        break;
      }
    }

    return {
      softLimits: soft,
      hardLimit: hard,
    }
  }

  private _getParentInfo(parent: FNodeBase, childrenPaddings: [number, number, number, number]): GetNodeBoundingIncludePaddingsResponse {
    return this._mediator.execute<GetNodeBoundingIncludePaddingsResponse>(
      new GetNodeBoundingIncludePaddingsRequest(parent, childrenPaddings),
    );
  }

  private _isAutoExpand(nodeOrGroup: FNodeBase): boolean {
    return nodeOrGroup.fAutoExpandOnChildHit();
  }

  private _makeLimit(
    nodeOrGroup: FNodeBase,
    { boundingRect, innerRect }: GetNodeBoundingIncludePaddingsResponse,
  ): IResizeLimit {
    return { nodeOrGroup, boundingRect, innerRect };
  }
}
