import { Component, DestroyRef, forwardRef, inject, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { IFlowNodeIvrForm } from './models/i-flow-node-ivr-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { IFlowNodeIvrFormValue } from './models/i-flow-node-ivr-form-value';
import { IVR_FORM_OUTPUT_LIST } from './constants/ivr-form-output-list';
import { INodeSelectOption } from '../../../domain';

@Component({
  selector: 'flow-node-ivr-form',
  templateUrl: './flow-node-ivr-form.html',
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodeIvrForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FlowNodeIvrForm),
      multi: true,
    },
  ],
})
export class FlowNodeIvrForm implements OnInit, ControlValueAccessor, Validator {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<IFlowNodeIvrFormValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<IFlowNodeIvrForm>;

  protected readonly outputs = IVR_FORM_OUTPUT_LIST;
  protected readonly timeouts: readonly INodeSelectOption<number>[] = [
    { key: 3, value: '3 sec' },
    { key: 5, value: '5 sec' },
    { key: 10, value: '10 sec' },
    { key: 15, value: '15 sec' },
    { key: 30, value: '30 sec' },
  ];

  public ngOnInit(): void {
    this._buildForm();
    this._listenFormChanges();
  }

  private _buildForm(): void {
    this.form = this._fb.group<IFlowNodeIvrForm>({
      outputs: this._fb.control(3),
      timeout: this._fb.control(5),
    });
  }

  private _listenFormChanges(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this._onChange?.(value);
        this._onTouch?.();
      });
  }

  public registerOnChange(fn: (value: Partial<IFlowNodeIvrFormValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public validate(): ValidationErrors | null {
    return this.form.invalid ? { invalid: true } : null;
  }

  public writeValue(value?: IFlowNodeIvrFormValue | null): void {
    this.form.patchValue(value ?? {}, { emitEvent: false });
  }
}
