import { IMinMaxPoint, IRect, ISize } from '../../../_libs/f-2d';
import { FNodeBase } from '../../../f-node';

export interface IDragNodeSoftConstraint {
  nodeOrGroup: FNodeBase;
  boundingRect: IRect;
  initialSize: ISize | undefined;
  limits: IMinMaxPoint;
}

export interface IDragNodeDeltaConstraints {
  hard: IMinMaxPoint;
  soft: IDragNodeSoftConstraint[];
}
