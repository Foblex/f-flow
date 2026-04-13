import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, } from '@angular/core';
import {
  EFMarkerType, EFResizeHandleType,
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowComponent,
  FFlowModule,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
  FZoomDirective
} from '@foblex/flow';
import { IPoint, Point, PointExtensions } from '@foblex/2d';
import {
  BuildFormHandler, BuildFormRequest,
  DatabaseApiService,
  EReloadReason,
  ETableRelationType,
  IDatabaseModel,
  ITableViewModel
} from '../../domain';
import { DbManagementToolbarComponent } from '../toolbar/db-management-toolbar.component';
import { DbManagementTableComponent } from '../table';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { DbManagementContextMenuComponent } from '../context-menu/db-management-context-menu.component';
import { SelectionService } from '../../domain/selection.service';
import { DbManagementConnectionToolbarComponent } from '../connection-toolbar/db-management-connection-toolbar.component';
import { startWith, Subscription } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { BrowserService } from '@foblex/platform';

@Component({
  selector: 'db-management-flow',
  templateUrl: './db-management-flow.component.html',
  styleUrls: [
    '../styles/_variables.scss',
    '../styles/_cdk-panel.scss',
    '../styles/_icon-button.scss',
    '../styles/_mdc-form-field.scss',
    './db-management-flow.component.scss',
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DatabaseApiService,
    SelectionService
  ],
  imports: [
    FFlowModule,
    DbManagementToolbarComponent,
    DbManagementTableComponent,
    CdkContextMenuTrigger,
    DbManagementContextMenuComponent,
    DbManagementConnectionToolbarComponent,
  ],
  host: {
    '[class.single-selection]': 'isSingleSelection'
  }
})
export class DbManagementFlowComponent implements OnInit {

  private subscriptions$: Subscription = new Subscription();

  protected viewModel: IDatabaseModel = {
    tables: [],
    groups: [],
    connections: []
  };

  @ViewChild(FFlowComponent, { static: true })
  public fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: true })
  public fZoomDirective!: FZoomDirective;

  protected readonly eMarkerType = EFMarkerType;

  public isSingleSelection: boolean = true;

  protected form: FormGroup = new FormGroup({
    tables: new FormArray([])
  });

  public contextMenuPosition: IPoint = PointExtensions.initialize(0, 0);

  public eResizeHandleType = EFResizeHandleType;

  constructor(
    private apiService: DatabaseApiService,
    private selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef,
    private fBrowser: BrowserService
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions$.add(this.subscribeOnReloadData());
  }

  private subscribeOnReloadData(): Subscription {
    return this.apiService.reload$.pipe(startWith(null)).subscribe((reason: EReloadReason | null) => {
      this.getData();
      if (reason === EReloadReason.CONNECTION_CHANGED) {
        this.fFlowComponent.clearSelection();
      }
    });
  }

  public onInitialized(): void {
    this.fCanvasComponent.fitToScreen(new Point(140, 140), false);
  }

  private getData(): void {
    this.viewModel = this.apiService.get();
    this.form = new BuildFormHandler().handle(new BuildFormRequest(this.viewModel));
    this.changeDetectorRef.markForCheck();
  }

  public getTableForm(id: string): FormGroup {
    return (this.form.get('tables') as FormGroup).get(id) as FormGroup;
  }

  public canvasChanged(event: FCanvasChangeEvent): void {
    this.fBrowser.document.documentElement.style.setProperty('--flow-scale', `${ event.scale }`);
  }

  public selectionChanged(event: FSelectionChangeEvent): void {
    this.isSingleSelection = event.fConnectionIds.length + event.fNodeIds.length === 1;
    this.selectionService.setTables(event.fNodeIds);
    this.changeDetectorRef.markForCheck();
  }

  public reassignConnection(event: FReassignConnectionEvent): void {
    if(!event.newTargetId) {
      return;
    }
    this.apiService.reassignConnection(event.connectionId, event.newTargetId);
    this.getData();
  }

  public createConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.apiService.createConnection(event.fOutputId, event.fInputId, ETableRelationType.ONE_TO_ONE);
    this.getData();
  }

  public moveTable(point: IPoint, table: ITableViewModel): void {
    table.position = point;
    this.apiService.moveTable(table.id, point);
  }

  public onContextMenu(event: MouseEvent): void {
    this.contextMenuPosition = this.fFlowComponent.getPositionInFlow(
      PointExtensions.initialize(event.clientX, event.clientY)
    );
  }
}
