import { IFBackgroundPattern } from '../i-f-background-pattern';

export class AddPatternToBackgroundRequest {
  constructor(
    public fPattern: IFBackgroundPattern | undefined
  ) {
  }
}
