import { Component, DestroyRef, forwardRef, inject, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { INodeSelectOption, IQueueCallNodeValue, QueuePriority } from '../../../domain';

interface QueueForm {
  queueName: FormControl<IQueueCallNodeValue['queueName']>;
  maxWaitTime: FormControl<IQueueCallNodeValue['maxWaitTime']>;
  priority: FormControl<QueuePriority | null>;
  musicOnHold: FormControl<IQueueCallNodeValue['musicOnHold']>;
}

@Component({
  selector: 'flow-node-queue-form',
  templateUrl: './flow-node-queue-form.html',
  standalone: true,
  imports: [MatFormField, MatInput, MatSelect, MatOption, MatCheckbox, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodeQueueForm),
      multi: true,
    },
  ],
})
export class FlowNodeQueueForm implements OnInit, ControlValueAccessor {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<IQueueCallNodeValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<QueueForm>;

  protected readonly priorities: readonly INodeSelectOption<QueuePriority>[] = [
    { key: 'low', value: 'Low' },
    { key: 'normal', value: 'Normal' },
    { key: 'high', value: 'High' },
    { key: 'urgent', value: 'Urgent' },
  ];

  protected readonly waitTimes: readonly INodeSelectOption<number>[] = [
    { key: 60, value: '1 min' },
    { key: 120, value: '2 min' },
    { key: 300, value: '5 min' },
    { key: 600, value: '10 min' },
    { key: 900, value: '15 min' },
  ];

  public ngOnInit(): void {
    this.form = this._fb.group<QueueForm>({
      queueName: this._fb.control('default'),
      maxWaitTime: this._fb.control(300),
      priority: this._fb.control('normal'),
      musicOnHold: this._fb.control(true),
    });
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((v) => {
      this._onChange?.(v);
      this._onTouch?.();
    });
  }

  public registerOnChange(fn: (value: Partial<IQueueCallNodeValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public writeValue(value?: IQueueCallNodeValue | null): void {
    if (value) this.form.patchValue(value, { emitEvent: false });
  }
}
