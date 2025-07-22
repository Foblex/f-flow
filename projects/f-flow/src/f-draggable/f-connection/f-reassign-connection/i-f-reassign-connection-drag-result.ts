import { RoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../f-connection';
import { IConnectorAndRect } from '../../../domain';

export interface IFReassignConnectionDragResult {

  sourceConnectorRect: RoundedRect;

  targetConnectorRect: RoundedRect;

  fConnection: FConnectionBase;

  canBeConnectedInputs: IConnectorAndRect[];
}
