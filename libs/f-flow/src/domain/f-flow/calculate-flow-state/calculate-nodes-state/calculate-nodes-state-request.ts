import { Type } from '@angular/core';
import type { IFFlowStateNode } from '../i-f-flow-state-node';

export class CalculateNodesStateRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IFFlowStateNode[];

  static readonly fToken = Symbol('CalculateNodesStateRequest');
  constructor(
    public readonly component: Type<unknown>,
    public readonly measuredSize: boolean = false,
  ) {}
}
