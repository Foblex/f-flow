import { RoundedRect } from '@foblex/2d';
import { IConnectorAndRect } from '../../../domain';

export interface IFCreateConnectionDragResult {

  toConnectorRect: RoundedRect;

  fOutputId: string;

  canBeConnectedInputs: IConnectorAndRect[];
}
