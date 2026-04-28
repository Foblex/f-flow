import { ISize } from '@foblex/2d';
import { EFLayoutDirection } from '../enums';

export interface IFLayoutOptions<TAlgorithm extends string = string> {
  direction: EFLayoutDirection;

  nodeGap: number;

  layerGap: number;

  algorithm: TAlgorithm;

  defaultNodeSize: ISize;
}
