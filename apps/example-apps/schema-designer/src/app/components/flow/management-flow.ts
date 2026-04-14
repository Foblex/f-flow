import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import {
  EFMarkerType,
  FCanvasChangeEvent,
  FCanvasComponent,
  FConnectionContent,
  FCreateConnectionEvent,
  FFlowComponent,
  FFlowModule,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
  FZoomDirective,
} from '@foblex/flow';
import { IPoint, PointExtensions } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { ERelationType, ITable } from '../../domain';
import { FlowController, IContextMenuTarget } from '../../controllers/flow-controller';
import { EditorStore } from '../../store';
import { RelationToolbar } from '../relation-toolbar/relation-toolbar';
import { SelectionMenu } from '../selection-menu/selection-menu';
import { TableNode } from '../table-node/table-node';
import { ViewportToolbar } from '../viewport-toolbar/viewport-toolbar';

@Component({
  selector: 'schema-designer',
  templateUrl: './management-flow.html',
  styleUrl: './management-flow.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditorStore, FlowController],
  imports: [
    FFlowModule,
    FConnectionContent,
    TableNode,
    ViewportToolbar,
    CdkContextMenuTrigger,
    SelectionMenu,
    RelationToolbar,
  ],
})
export class ManagementFlow {
  private readonly _browser = inject(BrowserService);
  private readonly _controller = inject(FlowController);

  protected readonly store = inject(EditorStore);

  private readonly _flow = viewChild.required(FFlowComponent);
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _zoom = viewChild.required(FZoomDirective);

  protected readonly eMarkerType = EFMarkerType;

  protected onInitialized(): void {
    this._controller.register({
      flow: this._flow(),
      canvas: this._canvas(),
      zoom: this._zoom(),
    });
    this._controller.initializeViewport();
  }

  protected onCanvasChange(event: FCanvasChangeEvent): void {
    this._browser.document.documentElement.style.setProperty('--flow-scale', `${event.scale}`);
  }

  protected onSelectionChange(event: FSelectionChangeEvent): void {
    this.store.syncSelection(event.fNodeIds, event.fConnectionIds);
  }

  protected onReassignConnection(event: FReassignConnectionEvent): void {
    if (!event.newTargetId) {
      return;
    }

    this.store.reassignConnection(event.connectionId, event.newTargetId);
  }

  protected onCreateConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }

    this.store.createConnection(event.fOutputId, event.fInputId, ERelationType.ONE_TO_ONE);
  }

  protected onMoveTable(point: IPoint, table: ITable): void {
    this.store.moveTable(table.id, point);
  }

  protected onContextMenu(event: MouseEvent): void {
    const contextMenuTarget = this._syncSelectionFromEvent(event);

    this._controller.setContextMenuTarget(contextMenuTarget);
    this._controller.setContextMenuPosition(
      this._controller.getFlowPosition(PointExtensions.initialize(event.clientX, event.clientY)),
    );
  }

  private _syncSelectionFromEvent(event: MouseEvent): IContextMenuTarget {
    const path = event.composedPath();

    const columnTarget = this._findColumnTarget(path);

    if (columnTarget) {
      const { tableId, columnId } = columnTarget;

      if (!tableId || !columnId) {
        return this._clearContextMenuSelection();
      }

      this.store.selectColumn(tableId, columnId);
      this._controller.select([tableId], []);

      return columnTarget;
    }

    const tableTarget = this._findTableTarget(path);

    if (tableTarget) {
      const { tableId } = tableTarget;

      if (!tableId) {
        return this._clearContextMenuSelection();
      }

      this.store.selectTable(tableId);
      this._controller.select([tableId], []);

      return tableTarget;
    }

    const connectionTarget = this._findConnectionTarget(path);

    if (connectionTarget) {
      const { connectionId } = connectionTarget;

      if (!connectionId) {
        return this._clearContextMenuSelection();
      }

      this.store.selectConnection(connectionId);
      this._controller.select([], [connectionId]);

      return connectionTarget;
    }

    return this._clearContextMenuSelection();
  }

  private _findColumnTarget(path: EventTarget[]): IContextMenuTarget | null {
    for (const item of path) {
      if (!(item instanceof HTMLElement)) {
        continue;
      }

      const tableId = item.dataset['tableId'];
      const columnId = item.dataset['columnId'];

      if (tableId && columnId) {
        return {
          tableId,
          columnId,
          connectionId: null,
        };
      }
    }

    return null;
  }

  private _findTableTarget(path: EventTarget[]): IContextMenuTarget | null {
    for (const item of path) {
      if (!(item instanceof HTMLElement)) {
        continue;
      }

      if (!item.classList.contains('f-node')) {
        continue;
      }

      const tableId = item.dataset['fNodeId'];

      if (tableId) {
        return {
          tableId,
          columnId: null,
          connectionId: null,
        };
      }
    }

    return null;
  }

  private _findConnectionTarget(path: EventTarget[]): IContextMenuTarget | null {
    for (const item of path) {
      if (!(item instanceof HTMLElement)) {
        continue;
      }

      if (!item.classList.contains('f-connection')) {
        continue;
      }

      if (item.id) {
        return {
          tableId: null,
          columnId: null,
          connectionId: item.id,
        };
      }
    }

    return null;
  }

  private _clearContextMenuSelection(): IContextMenuTarget {
    this.store.clearSelection();
    this._controller.clearSelection();

    return {
      tableId: null,
      columnId: null,
      connectionId: null,
    };
  }
}
