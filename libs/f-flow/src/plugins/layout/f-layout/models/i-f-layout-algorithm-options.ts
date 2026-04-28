import { IFLayoutOptions } from './i-f-layout-options';

export interface IFLayoutAlgorithmOptions<
  TAlgorithm extends string = string,
> extends IFLayoutOptions<TAlgorithm> {}
