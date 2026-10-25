import { RoundedRect } from '../../../_libs/f-2d';
import { IConnectorRectRef } from '../../../domain';

export interface ICreateConnectionDragResult {
  toConnectorRect: RoundedRect;

  fOutputId: string;

  canBeConnectedInputs: IConnectorRectRef[];
}
