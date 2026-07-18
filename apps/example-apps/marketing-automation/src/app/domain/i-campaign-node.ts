import { IFStateNode } from '@foblex/flow';
import { ECampaignNodeType } from './e-campaign-node-type';

export interface ICampaignNodeOutput {
  id: string;
  key: string;
  label: string;
}

export interface ICampaignNode extends IFStateNode {
  type: ECampaignNodeType;
  title: string;
  description: string;
  detail: string;
  isActive: boolean;
  outputs: ICampaignNodeOutput[];
}

export type CampaignNodeRecord = ICampaignNode;
