import { FNodeBase } from '../../../f-node';

export class AddNodeToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddNodeToStoreRequest');
  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
