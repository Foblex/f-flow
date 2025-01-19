import { FNodeBase } from '../../../f-node';
import { IMinMaxPoint } from '@foblex/2d';

export interface INodeWithDistanceRestrictions extends IMinMaxPoint {

  fDraggedNode: FNodeBase;

  fParentNodes?: FNodeBase[];
}
