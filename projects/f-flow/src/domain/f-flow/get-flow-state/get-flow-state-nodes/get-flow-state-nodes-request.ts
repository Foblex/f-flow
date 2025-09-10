import { Type } from '@angular/core';

export class GetFlowStateNodesRequest {
  static readonly fToken = Symbol('GetFlowStateNodesRequest');
  constructor(
    public type: Type<any>,
  ) {
  }
}
