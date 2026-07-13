import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ISelectOption, IVoicemailNodeValue } from '../../../domain';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-voicemail-form',
  templateUrl: './call-center-voicemail-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatInput, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterVoicemailForm),
      multi: true,
    },
  ],
})
export class CallCenterVoicemailForm extends CallCenterNodeFormControl<IVoicemailNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<
    CallCenterNodeFormControls<IVoicemailNodeValue>
  >({
    greeting: this._formBuilder.control('Please leave a message after the beep.'),
    maxDuration: this._formBuilder.control(120),
  });

  protected readonly durations: readonly ISelectOption<number>[] = [
    { key: 30, value: '30 sec' },
    { key: 60, value: '1 min' },
    { key: 120, value: '2 min' },
    { key: 300, value: '5 min' },
  ];
}
