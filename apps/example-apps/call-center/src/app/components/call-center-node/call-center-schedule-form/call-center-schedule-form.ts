import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ICheckScheduleNodeValue } from '../../../domain';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-schedule-form',
  templateUrl: './call-center-schedule-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatInput, MatSelect, MatOption, MatCheckbox, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterScheduleForm),
      multi: true,
    },
  ],
})
export class CallCenterScheduleForm extends CallCenterNodeFormControl<ICheckScheduleNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<
    CallCenterNodeFormControls<ICheckScheduleNodeValue>
  >({
    startTime: this._formBuilder.control('09:00'),
    endTime: this._formBuilder.control('18:00'),
    timezone: this._formBuilder.control('UTC'),
    weekends: this._formBuilder.control(false),
  });

  protected readonly timezones = [
    'UTC',
    'US/Eastern',
    'US/Central',
    'US/Pacific',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
  ];
}
