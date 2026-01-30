import { RoundedRect } from '@foblex/2d';
import { IConnectorRectRef } from '../../../domain';
import { FConnectionBase } from '../../../f-connection-v2';

export interface IFReassignConnectionDragResult {
  isTargetDragHandle: boolean;

  sourceConnectorRect: RoundedRect;

  targetConnectorRect: RoundedRect;

  fConnection: FConnectionBase;

  connectableConnectors: IConnectorRectRef[];
}
