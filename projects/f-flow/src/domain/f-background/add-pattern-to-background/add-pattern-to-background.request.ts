import { IFBackgroundPattern } from '../../../f-backgroud';

export class AddPatternToBackgroundRequest {
  static readonly fToken = Symbol('AddPatternToBackgroundRequest');
  constructor(
    public fPattern: IFBackgroundPattern | undefined,
  ) {
  }
}
