import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { ETableColumnType, ITableViewModel } from '../../domain';
import { DbManagementTableColumnComponent } from './components';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionService } from '../../domain/selection.service';
import { MatOption, MatSelect } from '@angular/material/select';
import { DbManagementTableHeaderComponent } from './components';

@Component({
  selector: 'db-management-table',
  templateUrl: './db-management-table.component.html',
  styleUrls: ['./db-management-table.component.scss'],
  standalone: true,
  imports: [
    FFlowModule,
    DbManagementTableColumnComponent,
    MatFormField,
    MatInput,
    FormsModule,
    MatSelect,
    MatOption,
    DbManagementTableHeaderComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.has-errors]': '!form.valid',
  },
})
export class DbManagementTableComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true })
  public viewModel!: ITableViewModel;

  protected columnTypes: string[] = Object.values(ETableColumnType);

  @ViewChildren(DbManagementTableColumnComponent)
  private columns!: QueryList<DbManagementTableColumnComponent>;

  private readonly destroy = new Subject<void>();

  @Input({ required: true })
  public form!: FormGroup;

  public getColumnForm(id: string): FormGroup {
    return (this.form.get('columns') as FormGroup).get(id) as FormGroup;
  }

  constructor(
    private selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.subscribeToSelectionServiceSelectionChanges();
  }

  private subscribeToSelectionServiceSelectionChanges(): void {
    this.selectionService.selection$
      .pipe(takeUntil(this.destroy), debounceTime(5))
      .subscribe((x) => {
        const column = this.columns.find((c) => c.column.id === x.column);
        this.selectColumn(column);
      });
  }

  private selectColumn(column?: DbManagementTableColumnComponent): void {
    this.columns.forEach((x) => x.select(x === column));
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
