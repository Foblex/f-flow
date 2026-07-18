import { IFStateData } from '@foblex/flow';
import { CampaignConnectionRecord } from './i-campaign-connection';
import { CampaignNodeRecord } from './i-campaign-node';

export type CampaignFlowSnapshot = IFStateData<CampaignNodeRecord, CampaignConnectionRecord>;
