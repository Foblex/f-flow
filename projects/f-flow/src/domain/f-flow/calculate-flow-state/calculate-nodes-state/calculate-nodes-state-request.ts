import { Type } from '@angular/core';

export class CalculateNodesStateRequest {
  static readonly fToken = Symbol('CalculateNodesStateRequest');
  constructor(public readonly component: Type<unknown>) {}
}
