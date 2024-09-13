import { IPoint } from '@foblex/2d';
import { ENodeType } from '../../e-node-type';

export class AddNewNodeToFlowRequest {

  constructor(
    public readonly type: ENodeType,
    public readonly position: IPoint,
  ) {
  }
}
