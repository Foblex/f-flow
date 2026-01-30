import { RoundedRect } from '@foblex/2d';
import { IConnectorAndRect } from '../../../domain';

export interface ICreateConnectionDragResult {
  toConnectorRect: RoundedRect;

  fOutputId: string;

  canBeConnectedInputs: IConnectorAndRect[];
}
