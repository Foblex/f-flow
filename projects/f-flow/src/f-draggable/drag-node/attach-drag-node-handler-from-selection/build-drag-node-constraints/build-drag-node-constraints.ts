import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IMinMaxPoint, IPoint, IRect, PointExtensions } from '@foblex/2d';
import { BuildDragNodeConstraintsRequest } from './build-drag-node-constraints-request';
import { infinityMinMax } from '../../../../utils';
import { FNodeBase } from '../../../../f-node';
import { GetNormalizedElementRectRequest, GetParentNodesRequest } from '../../../../domain';
import {
  ReadNodeBoundsWithPaddingsRequest,
  ReadNodeBoundsWithPaddingsResponse,
} from '../read-node-bounds-with-paddings';
import { IDragNodeDeltaConstraints, IDragNodeSoftConstraint } from '../../drag-node-constraint';

@Injectable()
@FExecutionRegister(BuildDragNodeConstraintsRequest)
export class BuildDragNodeConstraints
  implements IExecution<BuildDragNodeConstraintsRequest, IDragNodeDeltaConstraints>
{
  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup }: BuildDragNodeConstraintsRequest): IDragNodeDeltaConstraints {
    const currentRect = this._readCurrentRect(nodeOrGroup);
    const parents = this._readParentsChain(nodeOrGroup);

    return this._buildConstraints(parents, currentRect);
  }

  private _readCurrentRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(nodeOrGroup.hostElement),
    );
  }

  private _readParentsChain(nodeOrGroup: FNodeBase): FNodeBase[] {
    return this._mediator.execute<FNodeBase[]>(new GetParentNodesRequest(nodeOrGroup)) ?? [];
  }

  private _buildConstraints(parents: FNodeBase[], childRect: IRect): IDragNodeDeltaConstraints {
    const soft: IDragNodeSoftConstraint[] = [];
    let hard: IMinMaxPoint = infinityMinMax();

    let childrenPaddings: [number, number, number, number] = [0, 0, 0, 0];

    for (const parent of parents) {
      const parentInfo = this._readParentBounds(parent, childrenPaddings);
      childrenPaddings = parentInfo.paddings;
      const limits = this._calculateDifference(parentInfo.innerRect, childRect);

      if (this._isAutoExpand(parent)) {
        soft.push(this._makeSoftLimit(parent, parentInfo.boundingRect, limits));
      } else {
        hard = limits;
        break;
      }
    }

    return { soft, hard };
  }

  private _readParentBounds(
    parent: FNodeBase,
    childrenPaddings: [number, number, number, number],
  ): ReadNodeBoundsWithPaddingsResponse {
    return this._mediator.execute<ReadNodeBoundsWithPaddingsResponse>(
      new ReadNodeBoundsWithPaddingsRequest(parent, childrenPaddings),
    );
  }

  private _calculateDifference(parentRect: IRect, currentRect: IRect): IMinMaxPoint {
    return {
      min: this._calculateMinimumDifference(parentRect, currentRect),
      max: this._calculateMaximumDifference(parentRect, currentRect),
    };
  }

  private _calculateMinimumDifference(parentRect: IRect, currentRect: IRect): IPoint {
    return PointExtensions.initialize(parentRect.x - currentRect.x, parentRect.y - currentRect.y);
  }

  private _calculateMaximumDifference(parentRect: IRect, currentRect: IRect): IPoint {
    return PointExtensions.initialize(
      parentRect.x + parentRect.width - (currentRect.x + currentRect.width),
      parentRect.y + parentRect.height - (currentRect.y + currentRect.height),
    );
  }

  private _isAutoExpand(nodeOrGroup: FNodeBase): boolean {
    return nodeOrGroup.fAutoExpandOnChildHit();
  }

  private _makeSoftLimit(
    nodeOrGroup: FNodeBase,
    boundingRect: IRect,
    limits: IMinMaxPoint,
  ): IDragNodeSoftConstraint {
    return { nodeOrGroup, boundingRect, initialSize: nodeOrGroup._size, limits };
  }
}
