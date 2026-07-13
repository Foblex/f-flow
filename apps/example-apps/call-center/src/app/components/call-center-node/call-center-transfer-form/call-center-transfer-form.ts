import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ISelectOption, ITransferCallNodeValue } from '../../../domain';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-transfer-form',
  templateUrl: './call-center-transfer-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatInput, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterTransferForm),
      multi: true,
    },
  ],
})
export class CallCenterTransferForm extends CallCenterNodeFormControl<ITransferCallNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<
    CallCenterNodeFormControls<ITransferCallNodeValue>
  >({
    phoneNumber: this._formBuilder.control(''),
    ringTimeout: this._formBuilder.control(30),
  });

  protected readonly ringTimeouts: readonly ISelectOption<number>[] = [
    { key: 15, value: '15 sec' },
    { key: 30, value: '30 sec' },
    { key: 45, value: '45 sec' },
    { key: 60, value: '60 sec' },
  ];
}
