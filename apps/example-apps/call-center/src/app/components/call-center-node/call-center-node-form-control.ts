import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validator,
} from '@angular/forms';

export type CallCenterNodeFormControls<TValue extends object> = {
  [TKey in keyof TValue]: FormControl<TValue[TKey]>;
};

@Directive()
export abstract class CallCenterNodeFormControl<TValue extends object>
  implements OnInit, ControlValueAccessor, Validator
{
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: TValue) => void = () => {};
  private _onTouched: () => void = () => {};

  protected abstract readonly form: FormGroup<CallCenterNodeFormControls<TValue>>;

  public ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._onChange(this.form.getRawValue() as TValue);
      this._onTouched();
    });
  }

  public registerOnChange(onChange: (value: TValue) => void): void {
    this._onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this._onTouched = onTouched;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  public validate(): ValidationErrors | null {
    return this.form.invalid ? { invalid: true } : null;
  }

  public writeValue(value?: TValue | null): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    }
  }
}
