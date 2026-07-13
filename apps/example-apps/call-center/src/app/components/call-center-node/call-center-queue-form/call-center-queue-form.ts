import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IQueueCallNodeValue, ISelectOption, QueuePriority } from '../../../domain';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-queue-form',
  templateUrl: './call-center-queue-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatInput, MatSelect, MatOption, MatCheckbox, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterQueueForm),
      multi: true,
    },
  ],
})
export class CallCenterQueueForm extends CallCenterNodeFormControl<IQueueCallNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<
    CallCenterNodeFormControls<IQueueCallNodeValue>
  >({
    queueName: this._formBuilder.control('default'),
    maxWaitTime: this._formBuilder.control(300),
    priority: this._formBuilder.control('normal'),
    musicOnHold: this._formBuilder.control(true),
  });

  protected readonly priorities: readonly ISelectOption<QueuePriority>[] = [
    { key: 'low', value: 'Low' },
    { key: 'normal', value: 'Normal' },
    { key: 'high', value: 'High' },
    { key: 'urgent', value: 'Urgent' },
  ];

  protected readonly waitTimes: readonly ISelectOption<number>[] = [
    { key: 60, value: '1 min' },
    { key: 120, value: '2 min' },
    { key: 300, value: '5 min' },
    { key: 600, value: '10 min' },
    { key: 900, value: '15 min' },
  ];
}
