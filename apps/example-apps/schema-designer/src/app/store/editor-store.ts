import { computed, Injectable, signal } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import {
  createSeedState,
  EColumnKey,
  EColumnType,
  ERelationType,
  IColumn,
  IConnection,
  IGroup,
  ITable,
} from '../domain';

@Injectable()
export class EditorStore {
  private readonly _seed = createSeedState();

  private readonly _tables = signal<ITable[]>(this._seed.tables);
  private readonly _connections = signal<IConnection[]>(this._seed.connections);
  private readonly _groups = signal<IGroup[]>(this._seed.groups);

  private readonly _selectedTableIds = signal<string[]>([]);
  private readonly _selectedConnectionIds = signal<string[]>([]);
  private readonly _selectedColumnId = signal<string | null>(null);
  private readonly _selectedColumnTableId = signal<string | null>(null);

  public readonly tables = this._tables.asReadonly();
  public readonly connections = this._connections.asReadonly();
  public readonly groups = this._groups.asReadonly();
  public readonly selectedColumnId = this._selectedColumnId.asReadonly();
  public readonly selectedColumnTableId = this._selectedColumnTableId.asReadonly();

  public readonly isSingleSelection = computed(
    () => this._selectedTableIds().length + this._selectedConnectionIds().length === 1,
  );

  public readonly selectedTableId = computed(() => {
    const selectedTableIds = this._selectedTableIds();

    return selectedTableIds.length === 1 && this._selectedConnectionIds().length === 0
      ? selectedTableIds[0]
      : null;
  });

  public readonly selectedConnectionId = computed(() => {
    const selectedConnectionIds = this._selectedConnectionIds();

    return selectedConnectionIds.length === 1 && this._selectedTableIds().length === 0
      ? selectedConnectionIds[0]
      : null;
  });

  // --- Selection ---

  public syncSelection(tableIds: string[], connectionIds: string[]): void {
    this._selectedTableIds.set(tableIds);
    this._selectedConnectionIds.set(connectionIds);
    this._selectedColumnId.set(null);
    this._selectedColumnTableId.set(null);
  }

  public selectTable(tableId: string): void {
    this._selectedTableIds.set([tableId]);
    this._selectedConnectionIds.set([]);
    this._selectedColumnId.set(null);
    this._selectedColumnTableId.set(null);
  }

  public selectColumn(tableId: string, columnId: string): void {
    this._selectedTableIds.set([tableId]);
    this._selectedConnectionIds.set([]);
    this._selectedColumnId.set(columnId);
    this._selectedColumnTableId.set(tableId);
  }

  public selectConnection(connectionId: string): void {
    this._selectedTableIds.set([]);
    this._selectedConnectionIds.set([connectionId]);
    this._selectedColumnId.set(null);
    this._selectedColumnTableId.set(null);
  }

  public clearSelection(): void {
    this._selectedTableIds.set([]);
    this._selectedConnectionIds.set([]);
    this._selectedColumnId.set(null);
    this._selectedColumnTableId.set(null);
  }

  public clearColumnSelection(): void {
    this._selectedColumnId.set(null);
    this._selectedColumnTableId.set(null);
  }

  // --- Tables ---

  public createTable(position: IPoint): void {
    this._tables.update((tables) => [
      ...tables,
      {
        id: generateGuid(),
        name: `table_${tables.length + 1}`,
        position,
        columns: [{ id: generateGuid(), name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY }],
      },
    ]);
  }

  public removeTable(tableId: string): void {
    const table = this._tables().find((item) => item.id === tableId);

    if (!table) {
      return;
    }

    const columnIds = new Set(table.columns.map((c) => c.id));

    this._tables.update((tables) => tables.filter((t) => t.id !== tableId));
    this._connections.update((connections) =>
      connections.filter((c) => !columnIds.has(c.from) && !columnIds.has(c.to)),
    );

    if (this.selectedTableId() === tableId) {
      this.clearSelection();
    }
  }

  public moveTable(tableId: string, position: IPoint): void {
    this._tables.update((tables) =>
      tables.map((t) => (t.id === tableId ? { ...t, position } : t)),
    );
  }

  // --- Columns ---

  public createColumn(tableId: string): void {
    this._tables.update((tables) =>
      tables.map((t) => {
        if (t.id !== tableId) return t;

        const column: IColumn = {
          id: generateGuid(),
          name: `column_${t.columns.length + 1}`,
          type: EColumnType.INT,
        };

        return { ...t, columns: [...t.columns, column] };
      }),
    );
  }

  public removeColumn(tableId: string, columnId: string): void {
    this._tables.update((tables) =>
      tables.map((t) =>
        t.id === tableId ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) } : t,
      ),
    );
    this._connections.update((connections) =>
      connections.filter((c) => c.from !== columnId && c.to !== columnId),
    );

    if (this._selectedColumnId() === columnId && this._selectedColumnTableId() === tableId) {
      this.clearColumnSelection();
    }
  }

  public changeColumnKey(tableId: string, columnId: string, key: EColumnKey | null): void {
    this._updateColumn(tableId, columnId, (c) => ({ ...c, key: key ?? undefined }));
  }

  public updateColumnName(tableId: string, columnId: string, name: string): void {
    this._updateColumn(tableId, columnId, (c) => ({ ...c, name }));
  }

  public updateColumnType(tableId: string, columnId: string, type: EColumnType): void {
    this._updateColumn(tableId, columnId, (c) => ({ ...c, type }));
  }

  // --- Connections ---

  public createConnection(outputId: string, inputId: string, type: ERelationType): void {
    if (this._connections().some((connection) => connection.from === outputId && connection.to === inputId)) {
      return;
    }

    this._connections.update((connections) => [
      ...connections,
      { id: generateGuid(), from: outputId, to: inputId, type },
    ]);
  }

  public reassignConnection(connectionId: string, newInputId: string): void {
    const connection = this._connections().find((item) => item.id === connectionId);

    if (!connection) {
      return;
    }

    const hasDuplicate = this._connections().some(
      (item) => item.id !== connectionId && item.from === connection.from && item.to === newInputId,
    );

    if (hasDuplicate) {
      return;
    }

    this._connections.update((connections) =>
      connections.map((c) => (c.id === connectionId ? { ...c, to: newInputId } : c)),
    );
  }

  public changeConnectionType(connectionId: string, type: ERelationType): void {
    this._connections.update((connections) =>
      connections.map((c) => (c.id === connectionId ? { ...c, type } : c)),
    );
  }

  public removeConnection(connectionId: string): void {
    this._connections.update((connections) => connections.filter((c) => c.id !== connectionId));

    if (this.selectedConnectionId() === connectionId) {
      this.clearSelection();
    }
  }

  // --- Private helpers ---

  private _updateColumn(tableId: string, columnId: string, updater: (c: IColumn) => IColumn): void {
    this._tables.update((tables) =>
      tables.map((t) =>
        t.id === tableId
          ? { ...t, columns: t.columns.map((c) => (c.id === columnId ? updater(c) : c)) }
          : t,
      ),
    );
  }
}
