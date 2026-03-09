import { ILine } from '@foblex/2d';

export interface IFConnectionWorkerResultItem {
  originalIndex?: number;
  supported: boolean;
  sourceSide?: string;
  targetSide?: string;
  line?: ILine;
}
