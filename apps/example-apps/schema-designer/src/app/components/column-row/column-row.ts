import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FFlowModule } from '@foblex/flow';
import { EColumnKey, EColumnType, IColumn } from '../../domain';
import { EditorStore } from '../../store';

@Component({
  selector: 'column-row',
  templateUrl: './column-row.html',
  styleUrl: './column-row.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, MatIcon, MatFormField, MatInput, MatSelect, MatOption, FormsModule],
  host: {
    class: 'column-row',
    'tabindex': '-1',
    '[class.selected]': 'isSelected()',
    '[attr.data-column-id]': 'column().id',
    '[attr.data-table-id]': 'tableId()',
  },
})
export class ColumnRow {
  private readonly _store = inject(EditorStore);

  public readonly column = input.required<IColumn>();
  public readonly tableId = input.required<string>();
  public readonly columnTypes = input.required<string[]>();

  protected readonly eColumnKey = EColumnKey;

  protected readonly isSelected = computed(
    () =>
      this._store.selectedColumnId() === this.column().id &&
      this._store.selectedColumnTableId() === this.tableId(),
  );

  protected onNameChange(value: string): void {
    this._store.updateColumnName(this.tableId(), this.column().id, value);
  }

  protected onTypeChange(value: EColumnType): void {
    this._store.updateColumnType(this.tableId(), this.column().id, value);
  }
}
