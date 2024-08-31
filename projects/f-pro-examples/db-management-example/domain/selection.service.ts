import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SelectionService {

  private selection: Subject<ISelectionEvent> = new Subject<ISelectionEvent>();

  public get selection$(): Observable<ISelectionEvent> {
    return this.selection.asObservable();
  }

  private column: string | null = null;

  private tables: string[] = [];

  public setColumn(table: string, column: string | null): void {
    this.tables = [table];
    this.column = column;
    this.selection.next({ tables: this.tables, column: this.column });
  }

  public setTables(tables: string[]): void {
    this.tables = tables;
    this.column = null;
    this.selection.next({ tables: this.tables, column: this.column });
  }

  public reset(): void {
    this.tables = [];
    this.column = null;
    this.selection.next({ tables: this.tables, column: this.column });
  }

  public getColumn(): string | null {
    return this.column;
  }
}

export interface ISelectionEvent {

  tables: string[];

  column: string | null;
}
