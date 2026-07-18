import { ECampaignNodeType } from './e-campaign-node-type';

export type CampaignNodeGroup = 'Audience' | 'Channels' | 'Flow control' | 'Outcomes';

export interface ICampaignNodeMetadata {
  name: string;
  icon: string;
  group: CampaignNodeGroup;
  defaultTitle: string;
  defaultDescription: string;
  defaultDetail: string;
  addable: boolean;
  terminal: boolean;
}

export const CAMPAIGN_NODE_GROUPS: CampaignNodeGroup[] = [
  'Channels',
  'Flow control',
  'Audience',
  'Outcomes',
];

export const CAMPAIGN_NODE_METADATA: Record<ECampaignNodeType, ICampaignNodeMetadata> = {
  [ECampaignNodeType.TRIGGER]: {
    name: 'Campaign trigger',
    icon: 'bolt',
    group: 'Audience',
    defaultTitle: 'Audience enters campaign',
    defaultDescription: 'Starts when a customer matches the campaign audience.',
    defaultDetail: 'Live audience',
    addable: false,
    terminal: false,
  },
  [ECampaignNodeType.AUDIENCE]: {
    name: 'Audience filter',
    icon: 'filter_alt',
    group: 'Audience',
    defaultTitle: 'Filter audience',
    defaultDescription: 'Keep contacts that match a focused segment.',
    defaultDetail: 'All conditions',
    addable: true,
    terminal: false,
  },
  [ECampaignNodeType.EMAIL]: {
    name: 'Send email',
    icon: 'mail',
    group: 'Channels',
    defaultTitle: 'Send campaign email',
    defaultDescription: 'Deliver a personalized email to this branch.',
    defaultDetail: 'Marketing email',
    addable: true,
    terminal: false,
  },
  [ECampaignNodeType.SMS]: {
    name: 'Send SMS',
    icon: 'sms',
    group: 'Channels',
    defaultTitle: 'Send SMS reminder',
    defaultDescription: 'Reach the customer with a concise mobile message.',
    defaultDetail: 'Transactional SMS',
    addable: true,
    terminal: false,
  },
  [ECampaignNodeType.WAIT]: {
    name: 'Wait',
    icon: 'schedule',
    group: 'Flow control',
    defaultTitle: 'Wait before next step',
    defaultDescription: 'Pause this branch before continuing the journey.',
    defaultDetail: '2 hours',
    addable: true,
    terminal: false,
  },
  [ECampaignNodeType.CONDITION]: {
    name: 'Condition',
    icon: 'alt_route',
    group: 'Flow control',
    defaultTitle: 'Check customer activity',
    defaultDescription: 'Split the journey into Yes and No branches.',
    defaultDetail: 'Event matched',
    addable: true,
    terminal: false,
  },
  [ECampaignNodeType.WEBHOOK]: {
    name: 'Webhook',
    icon: 'webhook',
    group: 'Channels',
    defaultTitle: 'Notify external service',
    defaultDescription: 'Send campaign data to an external endpoint.',
    defaultDetail: 'POST request',
    addable: true,
    terminal: false,
  },
  [ECampaignNodeType.GOAL]: {
    name: 'Conversion goal',
    icon: 'flag',
    group: 'Outcomes',
    defaultTitle: 'Conversion completed',
    defaultDescription: 'Mark contacts that reach the campaign objective.',
    defaultDetail: 'Primary goal',
    addable: true,
    terminal: true,
  },
  [ECampaignNodeType.EXIT]: {
    name: 'Exit campaign',
    icon: 'logout',
    group: 'Outcomes',
    defaultTitle: 'Exit campaign',
    defaultDescription: 'Stop messaging contacts on this branch.',
    defaultDetail: 'Journey complete',
    addable: true,
    terminal: true,
  },
};

export const CAMPAIGN_ADDABLE_NODE_TYPES = Object.values(ECampaignNodeType).filter(
  (type) => CAMPAIGN_NODE_METADATA[type].addable,
);
