import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IPlayTextNodeValue } from '../../../domain';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-play-text-form',
  templateUrl: './call-center-play-text-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, ReactiveFormsModule, MatInput],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterPlayTextForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CallCenterPlayTextForm),
      multi: true,
    },
  ],
})
export class CallCenterPlayTextForm extends CallCenterNodeFormControl<IPlayTextNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<CallCenterNodeFormControls<IPlayTextNodeValue>>(
    {
      text: this._formBuilder.control(null, [Validators.required]),
    },
  );
}
