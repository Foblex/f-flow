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
import { INodeSelectOption, IVoiceMailNodeValue } from '../../../domain';

interface VoicemailForm {
  greeting: FormControl<IVoiceMailNodeValue['greeting']>;
  maxDuration: FormControl<IVoiceMailNodeValue['maxDuration']>;
}

@Component({
  selector: 'flow-node-voicemail-form',
  templateUrl: './flow-node-voicemail-form.html',
  standalone: true,
  imports: [MatFormField, MatInput, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodeVoicemailForm),
      multi: true,
    },
  ],
})
export class FlowNodeVoicemailForm implements OnInit, ControlValueAccessor {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<IVoiceMailNodeValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<VoicemailForm>;

  protected readonly durations: readonly INodeSelectOption<number>[] = [
    { key: 30, value: '30 sec' },
    { key: 60, value: '1 min' },
    { key: 120, value: '2 min' },
    { key: 300, value: '5 min' },
  ];

  public ngOnInit(): void {
    this.form = this._fb.group<VoicemailForm>({
      greeting: this._fb.control('Please leave a message after the beep.'),
      maxDuration: this._fb.control(120),
    });
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((v) => {
      this._onChange?.(v);
      this._onTouch?.();
    });
  }

  public registerOnChange(fn: (value: Partial<IVoiceMailNodeValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public writeValue(value?: IVoiceMailNodeValue | null): void {
    if (value) this.form.patchValue(value, { emitEvent: false });
  }
}
