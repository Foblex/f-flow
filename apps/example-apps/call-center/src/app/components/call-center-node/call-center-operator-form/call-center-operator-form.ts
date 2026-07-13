import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  IOperatorNodeValue,
  ISelectOption,
  OperatorDepartment,
  OperatorSkillLevel,
} from '../../../domain';
import {
  CallCenterNodeFormControl,
  CallCenterNodeFormControls,
} from '../call-center-node-form-control';

@Component({
  selector: 'call-center-operator-form',
  templateUrl: './call-center-operator-form.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatSelect, MatOption, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CallCenterOperatorForm),
      multi: true,
    },
  ],
})
export class CallCenterOperatorForm extends CallCenterNodeFormControl<IOperatorNodeValue> {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly form = this._formBuilder.group<CallCenterNodeFormControls<IOperatorNodeValue>>(
    {
      department: this._formBuilder.control('general'),
      skillLevel: this._formBuilder.control('any'),
    },
  );

  protected readonly departments: readonly ISelectOption<OperatorDepartment>[] = [
    { key: 'general', value: 'General' },
    { key: 'sales', value: 'Sales' },
    { key: 'support', value: 'Technical Support' },
    { key: 'billing', value: 'Billing' },
    { key: 'complaints', value: 'Complaints' },
  ];

  protected readonly skillLevels: readonly ISelectOption<OperatorSkillLevel>[] = [
    { key: 'any', value: 'Any' },
    { key: 'junior', value: 'Junior' },
    { key: 'senior', value: 'Senior' },
    { key: 'manager', value: 'Manager' },
  ];
}
