import { RoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../f-connection';
import { IConnectorAndRect } from '../../../domain';

export interface IFReassignConnectionDragResult {

  toConnectorRect: RoundedRect;

  fConnection: FConnectionBase;

  canBeConnectedInputs: IConnectorAndRect[];
}
