import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy, OnInit,
  TemplateRef, ViewChild
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { SelectionService } from '../../domain/selection.service';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DbManagementFlowComponent } from '../flow/db-management-flow.component';
import { DatabaseApiService, ETableColumnKey } from '../../domain';

@Component({
  selector: 'db-management-context-menu',
  templateUrl: './db-management-context-menu.component.html',
  styleUrls: [ './db-management-context-menu.component.scss' ],
  exportAs: 'menuComponent',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    CdkMenu,
    CdkMenuItem,
    MatIcon,
    CdkMenuTrigger,
  ]
})
export class DbManagementContextMenuComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  @ViewChild(TemplateRef, { static: true })
  public template!: TemplateRef<CdkMenu>;

  public column: string | null = null;

  public table: string | null = null;

  public eTableColumnKey = ETableColumnKey;

  constructor(
    private root: DbManagementFlowComponent,
    private apiService: DatabaseApiService,
    private selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions.add(this.subscribeToSelectionChanges());
  }

  private subscribeToSelectionChanges(): Subscription {
    return this.selectionService.selection$.subscribe((selection) => {
      this.column = selection.column;
      if (this.root.fFlowComponent.getSelection().nodes.length === 1) {
        this.table = this.root.fFlowComponent.getSelection().nodes[ 0 ];
      } else {
        this.table = null;
        this.column = null;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  public createTable(menu: CdkMenu): void {
    menu.menuStack.closeAll();
    this.apiService.createTable(this.root.contextMenuPosition);
  }

  public createColumn(menu: CdkMenu): void {
    menu.menuStack.closeAll();
    this.apiService.createColumn(this.table!);
  }

  public delete(table: string | null, column: string | null, menu: CdkMenu): void {
    menu.menuStack.closeAll();
    if (column && table) {
      this.apiService.removeColumn(table, column);
    } else if (table) {
      this.apiService.removeTable(table);
    }
  }

  public setColumnKey(table: string, column: string, key: ETableColumnKey | null, menu: CdkMenu): void {
    menu.menuStack.closeAll();
    this.apiService.changeColumnKey(table, column, key);
  }

  public dispose(): void {
    this.selectionService.reset();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
