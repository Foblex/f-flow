import { IPoint } from '@foblex/2d';

export interface IControlPoint {
  id: string;
  point: IPoint;
  userDefined: boolean;
}

export interface IControlPointCandidate {
  point: IPoint;
  kind: 'bend' | 'mid-segment' | 'curve-mid' | 'curve-sample';
  chainIndex: number;
}
