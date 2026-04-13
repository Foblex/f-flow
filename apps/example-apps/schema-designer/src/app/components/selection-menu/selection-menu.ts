import { ChangeDetectionStrategy, Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MatIcon } from '@angular/material/icon';
import { EColumnKey } from '../../domain';
import { FlowController, IContextMenuTarget } from '../../controllers/flow-controller';
import { EditorStore } from '../../store';

@Component({
  selector: 'selection-menu',
  templateUrl: './selection-menu.html',
  styleUrl: './selection-menu.scss',
  exportAs: 'selectionMenu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenu, CdkMenuItem, MatIcon],
})
export class SelectionMenu {
  private readonly _store = inject(EditorStore);
  private readonly _controller = inject(FlowController);
  private readonly _openedSubmenu = signal<'key' | null>(null);

  public readonly template = viewChild.required(TemplateRef);

  protected readonly eColumnKey = EColumnKey;
  protected readonly contextMenuTarget = this._controller.contextMenuTarget;
  protected readonly targetTableId = computed(() => this.contextMenuTarget().tableId);
  protected readonly targetColumnId = computed(() => this.contextMenuTarget().columnId);
  protected readonly targetConnectionId = computed(() => this.contextMenuTarget().connectionId);
  protected readonly isKeyMenuOpen = computed(() => this._openedSubmenu() === 'key' && !!this.targetColumnId());

  protected openKeyMenu(): void {
    if (this.targetColumnId()) {
      this._openedSubmenu.set('key');
    }
  }

  protected closeSubmenu(): void {
    this._openedSubmenu.set(null);
  }

  protected createTable(): void {
    this.closeSubmenu();

    const position = this._controller.contextMenuPosition();
    this._store.createTable(position);
  }

  protected createColumn(): void {
    this.closeSubmenu();

    const target = this._getTargetSnapshot();

    if (target.tableId) {
      this._store.createColumn(target.tableId);
    }
  }

  protected deleteSelection(): void {
    this.closeSubmenu();

    const target = this._getTargetSnapshot();

    if (target.columnId && target.tableId) {
      this._store.removeColumn(target.tableId, target.columnId);

      return;
    }

    if (target.tableId) {
      this._store.removeTable(target.tableId);

      return;
    }

    if (target.connectionId) {
      this._store.removeConnection(target.connectionId);
    }
  }

  protected setColumnKey(key: EColumnKey | null, menu: CdkMenu): void {
    this.closeSubmenu();

    const target = this._getTargetSnapshot();

    if (target.tableId && target.columnId) {
      this._store.changeColumnKey(target.tableId, target.columnId, key);
      menu.menuStack.closeAll();
    }
  }

  public dispose(): void {
    this.closeSubmenu();
    this._controller.clearContextMenuTarget();
  }

  private _getTargetSnapshot(): IContextMenuTarget {
    return this.contextMenuTarget();
  }
}
