import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { ETableColumnKey, ITableColumn } from '../../../../domain';
import { MatIcon } from '@angular/material/icon';
import { SelectionService } from '../../../../domain/selection.service';

@Component({
  selector: 'db-management-table-column',
  templateUrl: './db-management-table-column.component.html',
  styleUrls: ['./db-management-table-column.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, MatIcon],
  host: {
    'tabindex': '-1',
    '[class.selected]': 'isSelected',
    '(contextmenu)': 'emitSelectionChangeEvent($event)',
  },
})
export class DbManagementTableColumnComponent {
  @Input({ required: true })
  public column!: ITableColumn;

  @Input({ required: true })
  public tableId!: string;

  public eTableColumnKey = ETableColumnKey;

  protected isSelected = false;

  private get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  constructor(
    private elementRef: ElementRef,
    private selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  public select(isSelected: boolean): void {
    this.isSelected = isSelected;
    this.changeDetectorRef.detectChanges();
  }

  protected emitSelectionChangeEvent(event: MouseEvent): void {
    this.hostElement.focus();
    event.preventDefault();
    this.selectionService.setColumn(this.tableId, this.column.id);
  }
}
