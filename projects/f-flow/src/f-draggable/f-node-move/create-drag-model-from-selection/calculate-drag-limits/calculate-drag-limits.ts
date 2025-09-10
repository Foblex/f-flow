import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IMinMaxPoint, IPoint, IRect, PointExtensions } from "@foblex/2d";
import { CalculateDragLimitsRequest } from "./calculate-drag-limits-request";
import { infinityMinMax } from "../../../../utils";
import { FNodeBase } from "../../../../f-node";
import { GetNormalizedElementRectRequest, GetParentNodesRequest } from "../../../../domain";
import {
  GetNodeBoundingIncludePaddingsRequest,
  GetNodeBoundingIncludePaddingsResponse,
} from "../get-node-bounding-include-paddings";
import { ISoftLimit } from "./i-soft-limit";
import { IDragLimits } from "./i-drag-limits";

@Injectable()
@FExecutionRegister(CalculateDragLimitsRequest)
export class CalculateDragLimits
  implements IExecution<CalculateDragLimitsRequest, IDragLimits> {

  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup }: CalculateDragLimitsRequest): IDragLimits {
    const currentRect = this._getCurrentRect(nodeOrGroup);
    const parents = this._getParentsChain(nodeOrGroup);

    return this._buildSoftHardLimits(parents, currentRect);
  }

  private _getCurrentRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _getParentsChain(nodeOrGroup: FNodeBase): FNodeBase[] {
    return this._mediator.execute<FNodeBase[]>(new GetParentNodesRequest(nodeOrGroup)) ?? [];
  }

  private _buildSoftHardLimits(parents: FNodeBase[], childRect: IRect): IDragLimits {
    const soft: ISoftLimit[] = [];
    let hard: IMinMaxPoint = infinityMinMax();

    let childrenPaddings: [number, number, number, number] = [0, 0, 0, 0];

    for (const parent of parents) {
      const parentInfo = this._getParentInfo(parent, childrenPaddings);
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

  private _getParentInfo(parent: FNodeBase, childrenPaddings: [number, number, number, number]): GetNodeBoundingIncludePaddingsResponse {
    return this._mediator.execute<GetNodeBoundingIncludePaddingsResponse>(
      new GetNodeBoundingIncludePaddingsRequest(parent, childrenPaddings),
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
      (parentRect.x + parentRect.width) - (currentRect.x + currentRect.width),
      (parentRect.y + parentRect.height) - (currentRect.y + currentRect.height),
    );
  }

  private _isAutoExpand(nodeOrGroup: FNodeBase): boolean {
    return nodeOrGroup.fAutoExpandOnChildHit();
  }

  private _makeSoftLimit(
    nodeOrGroup: FNodeBase,
    boundingRect: IRect,
    limits: IMinMaxPoint,
  ): ISoftLimit {
    return { nodeOrGroup, boundingRect, initialSize: nodeOrGroup._size, limits };
  }
}
