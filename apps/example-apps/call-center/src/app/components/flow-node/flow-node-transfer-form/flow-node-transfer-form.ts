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
import { INodeSelectOption, ITransferCallNodeValue } from '../../../domain';

interface TransferForm {
  phoneNumber: FormControl<ITransferCallNodeValue['phoneNumber']>;
  ringTimeout: FormControl<ITransferCallNodeValue['ringTimeout']>;
}

@Component({
  selector: 'flow-node-transfer-form',
  templateUrl: './flow-node-transfer-form.html',
  standalone: true,
  imports: [MatFormField, MatInput, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodeTransferForm),
      multi: true,
    },
  ],
})
export class FlowNodeTransferForm implements OnInit, ControlValueAccessor {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<ITransferCallNodeValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<TransferForm>;

  protected readonly ringTimeouts: readonly INodeSelectOption<number>[] = [
    { key: 15, value: '15 sec' },
    { key: 30, value: '30 sec' },
    { key: 45, value: '45 sec' },
    { key: 60, value: '60 sec' },
  ];

  public ngOnInit(): void {
    this.form = this._fb.group<TransferForm>({
      phoneNumber: this._fb.control(''),
      ringTimeout: this._fb.control(30),
    });
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((v) => {
      this._onChange?.(v);
      this._onTouch?.();
    });
  }

  public registerOnChange(fn: (value: Partial<ITransferCallNodeValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public writeValue(value?: ITransferCallNodeValue | null): void {
    if (value) this.form.patchValue(value, { emitEvent: false });
  }
}
