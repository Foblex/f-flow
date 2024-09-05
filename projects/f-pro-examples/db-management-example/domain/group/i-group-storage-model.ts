import { IPoint, ISize } from '@foblex/core';

export interface IGroupStorageModel {

  id: string;

  name: string;

  position: IPoint;

  size: ISize;
}
