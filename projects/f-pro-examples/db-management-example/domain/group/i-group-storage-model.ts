import { IPoint, ISize } from '@foblex/2d';

export interface IGroupStorageModel {

  id: string;

  name: string;

  position: IPoint;

  size: ISize;

  parentId?: string;
}
