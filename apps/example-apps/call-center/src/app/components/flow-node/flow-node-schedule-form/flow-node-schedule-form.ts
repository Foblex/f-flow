import { Component, DestroyRef, forwardRef, inject, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckbox } from '@angular/material/checkbox';
import { ICheckScheduleNodeValue } from '../../../domain';

interface ScheduleForm {
  startTime: FormControl<ICheckScheduleNodeValue['startTime']>;
  endTime: FormControl<ICheckScheduleNodeValue['endTime']>;
  timezone: FormControl<ICheckScheduleNodeValue['timezone']>;
  weekends: FormControl<ICheckScheduleNodeValue['weekends']>;
}

@Component({
  selector: 'flow-node-schedule-form',
  templateUrl: './flow-node-schedule-form.html',
  standalone: true,
  imports: [MatFormField, MatInput, MatSelect, MatOption, MatCheckbox, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodeScheduleForm),
      multi: true,
    },
  ],
})
export class FlowNodeScheduleForm implements OnInit, ControlValueAccessor {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<ICheckScheduleNodeValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<ScheduleForm>;

  protected readonly timezones = [
    'UTC',
    'US/Eastern',
    'US/Central',
    'US/Pacific',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
  ];

  public ngOnInit(): void {
    this.form = this._fb.group<ScheduleForm>({
      startTime: this._fb.control('09:00'),
      endTime: this._fb.control('18:00'),
      timezone: this._fb.control('UTC'),
      weekends: this._fb.control(false),
    });
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((v) => {
      this._onChange?.(v);
      this._onTouch?.();
    });
  }

  public registerOnChange(fn: (value: Partial<ICheckScheduleNodeValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public writeValue(value?: ICheckScheduleNodeValue | null): void {
    if (value) this.form.patchValue(value, { emitEvent: false });
  }
}
