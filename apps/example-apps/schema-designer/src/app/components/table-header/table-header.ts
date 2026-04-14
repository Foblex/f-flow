import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ITable } from '../../domain';
import { EditorStore } from '../../store';

@Component({
  selector: 'table-header',
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class TableHeader {
  private readonly _store = inject(EditorStore);

  public readonly table = input.required<ITable>();

  protected removeTable(): void {
    this._store.removeTable(this.table().id);
  }

  protected createColumn(): void {
    this._store.createColumn(this.table().id);
  }
}
