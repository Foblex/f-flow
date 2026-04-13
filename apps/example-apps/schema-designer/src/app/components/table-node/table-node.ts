import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { EColumnType, ITable } from '../../domain';
import { TableHeader } from '../table-header/table-header';
import { ColumnRow } from '../column-row/column-row';

@Component({
  selector: 'table-node',
  templateUrl: './table-node.html',
  styleUrl: './table-node.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, TableHeader, ColumnRow],
})
export class TableNode {
  public readonly table = input.required<ITable>();

  protected readonly columnTypes = Object.values(EColumnType);
}
