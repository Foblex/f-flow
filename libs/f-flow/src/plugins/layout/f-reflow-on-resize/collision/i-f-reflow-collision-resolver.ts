import { IPoint, IRect } from '@foblex/2d';
import { IReflowCandidate } from '../selection';

export interface IReflowRawShift {
  candidate: IReflowCandidate;
  shift: IPoint;
}

export interface IReflowResolvedShift {
  candidate: IReflowCandidate;
  fromRect: IRect;
  toRect: IRect;
  toPosition: IPoint;
}

export interface IFReflowCollisionResolver {
  resolve(input: {
    sourceNextRect: IRect;
    rawShifts: IReflowRawShift[];
    pool: IReflowCandidate[];
    spacing: { vertical: number; horizontal: number };
    maxAbsoluteShift: number;
  }): IReflowResolvedShift[];
}
