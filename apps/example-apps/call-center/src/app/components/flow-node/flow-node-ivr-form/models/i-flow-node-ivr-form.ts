import { FormControl } from '@angular/forms';

export interface IFlowNodeIvrForm {
  outputs: FormControl<number | null>;
  timeout: FormControl<number | null>;
}
