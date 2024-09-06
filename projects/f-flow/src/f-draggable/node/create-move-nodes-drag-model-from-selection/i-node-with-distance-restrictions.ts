import { FNodeBase } from '../../../f-node';
import { INodeMoveRestrictions } from './domain/get-node-move-restrictions';

export interface INodeWithDistanceRestrictions extends INodeMoveRestrictions {

  node: FNodeBase;

  parentNodes?: FNodeBase[];
}
