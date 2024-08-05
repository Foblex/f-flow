import { IPoint } from '@foblex/core';
import { ENodeType } from '../../e-node-type';

export class AddNewNodeToFlowRequest {

  constructor(
    public readonly type: ENodeType,
    public readonly position: IPoint,
  ) {
  }
}
