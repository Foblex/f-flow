import { RoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../f-connection';
import { IConnectorAndRect } from '../../../domain';

export interface IFReassignConnectionDragResult {

  isTargetDragHandle: boolean;

  sourceConnectorRect: RoundedRect;

  targetConnectorRect: RoundedRect;

  fConnection: FConnectionBase;

  connectableConnectors: IConnectorAndRect[];
}
