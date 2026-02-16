import { RoundedRect } from '@foblex/2d';
import { IConnectorRectRef } from '../../../domain';

export interface ICreateConnectionDragResult {
  toConnectorRect: RoundedRect;

  fOutputId: string;

  canBeConnectedInputs: IConnectorRectRef[];
}
