import type { IFFlowState } from './i-f-flow-state';
export class CalculateFlowStateRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IFFlowState;

  static readonly fToken = Symbol('CalculateFlowStateRequest');

  constructor(public readonly measuredSize: boolean = false) {}
}
