import { IPoint, ISize } from '@foblex/2d';

export enum EColumnType {
  INT = 'int',
  VARCHAR = 'varchar',
  TEXT = 'text',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
}

export enum EColumnKey {
  PRIMARY = 'primary',
  UNIQUE = 'unique',
  INDEX = 'index',
}

export enum ERelationType {
  ONE_TO_ONE = '1:1',
  ONE_TO_MANY = '1:N',
  MANY_TO_ONE = 'N:1',
  MANY_TO_MANY = 'N:N',
}

export interface IColumn {
  id: string;
  name: string;
  type: EColumnType;
  key?: EColumnKey;
}

export interface ITable {
  id: string;
  name: string;
  columns: IColumn[];
  position: IPoint;
  parentId?: string;
}

export interface IConnection {
  id: string;
  from: string;
  to: string;
  type: ERelationType;
}

export interface IGroup {
  id: string;
  name: string;
  position: IPoint;
  parentId?: string;
}
