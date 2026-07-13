import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ISelectOption, IUserInputNodeValue } from '../../../domain';
import { IVR_FORM_OUTPUT_LIST } from './constants/ivr-form-output-list';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-ivr-form',
  templateUrl: './call-center-ivr-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterIvrForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CallCenterIvrForm),
      multi: true,
    },
  ],
})
export class CallCenterIvrForm extends CallCenterNodeFormControl<IUserInputNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<
    CallCenterNodeFormControls<IUserInputNodeValue>
  >({
    outputs: this._formBuilder.control(3),
    timeout: this._formBuilder.control(5),
  });

  protected readonly outputs = IVR_FORM_OUTPUT_LIST;
  protected readonly timeouts: readonly ISelectOption<number>[] = [
    { key: 3, value: '3 sec' },
    { key: 5, value: '5 sec' },
    { key: 10, value: '10 sec' },
    { key: 15, value: '15 sec' },
    { key: 30, value: '30 sec' },
  ];
}
