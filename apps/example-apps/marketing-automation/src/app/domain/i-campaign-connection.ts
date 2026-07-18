import { IFStateConnection } from '@foblex/flow';

export interface ICampaignConnection extends IFStateConnection {
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export type CampaignConnectionRecord = ICampaignConnection;
