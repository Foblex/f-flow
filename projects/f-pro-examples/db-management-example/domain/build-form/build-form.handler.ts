import { IHandler } from '@foblex/mediator';
import { BuildFormRequest } from './build-form.request';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ITableColumn, ITableViewModel } from '../table';

export class BuildFormHandler implements IHandler<BuildFormRequest, FormGroup> {


  public handle(request: BuildFormRequest): FormGroup {
    return new FormGroup({
      tables: this.createTables(request.db.tables)
    });
  }

  private createTables(tables: ITableViewModel[]): FormGroup {
    const result = new FormGroup({});
    tables.forEach((table, index) => {
      result.addControl(table.id, new FormGroup({
        name: new FormControl(table.name, [ Validators.required, this.uniqueNameValidator(result, index) ]),
        columns: this.createColumns(table.columns)
      }));
    })
    return result;
  }

  private createColumns(columns: ITableColumn[]): FormGroup {
    const result = new FormGroup({});
    columns.forEach((column, index) => {
      result.addControl(column.id, new FormGroup({
        name: new FormControl(column.name, [ Validators.required, this.uniqueNameValidator(result, index) ]),
        type: new FormControl(column.type, [ Validators.required ]),
      }));
    })
    return result;
  }

  private uniqueNameValidator(form: FormGroup, index: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const data = form.value;
      const names = Object.keys(data).map((key) => data[ key ].name.toLowerCase());
      names.splice(index, 1);
      const result = names.filter((x) => x === (control.value || '').trim().toLowerCase());
      return result.length ? { unique: true } : null;
    };
  }
}

