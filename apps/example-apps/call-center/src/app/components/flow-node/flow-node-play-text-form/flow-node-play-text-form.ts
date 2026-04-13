import { Component, DestroyRef, forwardRef, inject, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { IFlowNodePlayTextForm } from './models/i-flow-node-play-text-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { IFlowNodePlayTextFormValue } from './models/i-flow-node-play-text-form-value';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'flow-node-play-text-form',
  templateUrl: './flow-node-play-text-form.html',
  standalone: true,
  imports: [MatFormField, ReactiveFormsModule, MatInput],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodePlayTextForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FlowNodePlayTextForm),
      multi: true,
    },
  ],
})
export class FlowNodePlayTextForm implements OnInit, ControlValueAccessor, Validator {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<IFlowNodePlayTextFormValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<IFlowNodePlayTextForm>;

  public ngOnInit(): void {
    this._buildForm();
    this._listenFormChanges();
  }

  private _buildForm(): void {
    this.form = this._fb.group<IFlowNodePlayTextForm>({
      text: this._fb.control(null, [Validators.required]),
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

  public registerOnChange(fn: (value: Partial<IFlowNodePlayTextFormValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public validate(): ValidationErrors | null {
    return this.form.invalid ? { invalid: true } : null;
  }

  public writeValue(value?: IFlowNodePlayTextFormValue | null): void {
    this.form.patchValue(value ?? {}, { emitEvent: false });
  }
}
