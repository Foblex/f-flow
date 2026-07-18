import { IPoint } from '@foblex/2d';
import { ICampaignAddSlot } from '../domain';

export interface ICampaignLayoutResult {
  nodePositions: { id: string; position: IPoint }[];
  addSlots: ICampaignAddSlot[];
}
