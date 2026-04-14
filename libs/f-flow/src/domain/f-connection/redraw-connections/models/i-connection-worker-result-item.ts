import { ILine } from '@foblex/2d';

export interface IConnectionWorkerResultItem {
  originalIndex: number;
  supported: boolean;
  sourceSide?: string;
  targetSide?: string;
  line?: ILine;
}
