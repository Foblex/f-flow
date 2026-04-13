import { Component, DestroyRef, forwardRef, inject, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
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
import {
  INodeSelectOption,
  IOperatorNodeValue,
  OperatorDepartment,
  OperatorSkillLevel,
} from '../../../domain';

interface OperatorForm {
  department: FormControl<OperatorDepartment | null>;
  skillLevel: FormControl<OperatorSkillLevel | null>;
}

@Component({
  selector: 'flow-node-operator-form',
  templateUrl: './flow-node-operator-form.html',
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowNodeOperatorForm),
      multi: true,
    },
  ],
})
export class FlowNodeOperatorForm implements OnInit, ControlValueAccessor {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  private _onChange: (value: Partial<IOperatorNodeValue>) => void = () => {};
  private _onTouch: () => void = () => {};

  protected form!: FormGroup<OperatorForm>;

  protected readonly departments: readonly INodeSelectOption<OperatorDepartment>[] = [
    { key: 'general', value: 'General' },
    { key: 'sales', value: 'Sales' },
    { key: 'support', value: 'Technical Support' },
    { key: 'billing', value: 'Billing' },
    { key: 'complaints', value: 'Complaints' },
  ];

  protected readonly skillLevels: readonly INodeSelectOption<OperatorSkillLevel>[] = [
    { key: 'any', value: 'Any' },
    { key: 'junior', value: 'Junior' },
    { key: 'senior', value: 'Senior' },
    { key: 'manager', value: 'Manager' },
  ];

  public ngOnInit(): void {
    this.form = this._fb.group<OperatorForm>({
      department: this._fb.control('general'),
      skillLevel: this._fb.control('any'),
    });
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((v) => {
      this._onChange?.(v);
      this._onTouch?.();
    });
  }

  public registerOnChange(fn: (value: Partial<IOperatorNodeValue>) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  public writeValue(value?: IOperatorNodeValue | null): void {
    if (value) this.form.patchValue(value, { emitEvent: false });
  }
}
