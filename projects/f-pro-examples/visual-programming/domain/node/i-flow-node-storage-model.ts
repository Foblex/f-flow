import { ENodeType } from '../e-node-type';
import { IPoint } from '@foblex/core';

export interface IFlowNodeStorageModel {

  id: string;

  input?: string;

  output?: string;

  type: ENodeType;

  position: IPoint;
}
