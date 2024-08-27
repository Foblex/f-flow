import { IPoint } from '@foblex/core';

export class AddNewNodeToFlowRequest {

  constructor(
    public readonly position: IPoint,
  ) {
  }
}
