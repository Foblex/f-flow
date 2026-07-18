import { EFLayoutDirection } from '@foblex/flow';
import { CampaignFlowSnapshot } from '../domain';

export interface ICampaignDocument {
  direction: EFLayoutDirection;
  snapshot: CampaignFlowSnapshot;
}
