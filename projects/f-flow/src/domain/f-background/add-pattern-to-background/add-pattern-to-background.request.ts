import { IFBackgroundPattern } from '../../../f-backgroud';

export class AddPatternToBackgroundRequest {
  constructor(
    public fPattern: IFBackgroundPattern | undefined
  ) {
  }
}
