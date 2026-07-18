import { IPoint } from '@foblex/2d';

export interface ICampaignConnectionAddContext {
  kind: 'connection';
  connectionId: string;
}

export interface ICampaignOutputAddContext {
  kind: 'output';
  sourceNodeId: string;
  sourceConnectorId: string;
  outputLabel: string;
}

export type CampaignAddContext = ICampaignConnectionAddContext | ICampaignOutputAddContext;

export interface ICampaignAddSlot {
  id: string;
  targetConnectorId: string;
  position: IPoint;
  context: ICampaignOutputAddContext;
}
