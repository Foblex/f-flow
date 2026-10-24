import { IFBackgroundPattern } from '../../../f-backgroud';

export class AddPatternToBackgroundRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddPatternToBackgroundRequest');

  constructor(public fPattern: IFBackgroundPattern | undefined) {}
}
