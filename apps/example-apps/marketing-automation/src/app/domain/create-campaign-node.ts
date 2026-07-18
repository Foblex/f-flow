import { generateGuid } from '@foblex/utils';
import { CAMPAIGN_NODE_METADATA } from './campaign-node-metadata';
import { campaignOutputId } from './campaign-connectors';
import { ECampaignNodeType } from './e-campaign-node-type';
import { CampaignNodeRecord, ICampaignNodeOutput } from './i-campaign-node';

export function createCampaignNode(
  type: ECampaignNodeType,
  id: string = generateGuid(),
  patch: Partial<Omit<CampaignNodeRecord, 'id' | 'type' | 'outputs'>> = {},
): CampaignNodeRecord {
  const metadata = CAMPAIGN_NODE_METADATA[type];

  return {
    id,
    type,
    title: metadata.defaultTitle,
    description: metadata.defaultDescription,
    detail: metadata.defaultDetail,
    isActive: true,
    position: { x: 0, y: 0 },
    ...patch,
    outputs: createCampaignNodeOutputs(type, id),
  };
}

function createCampaignNodeOutputs(type: ECampaignNodeType, nodeId: string): ICampaignNodeOutput[] {
  if (type === ECampaignNodeType.CONDITION) {
    return [
      { id: campaignOutputId(nodeId, 'yes'), key: 'yes', label: 'Yes' },
      { id: campaignOutputId(nodeId, 'no'), key: 'no', label: 'No' },
    ];
  }

  if (CAMPAIGN_NODE_METADATA[type].terminal) {
    return [];
  }

  return [{ id: campaignOutputId(nodeId, 'next'), key: 'next', label: '' }];
}
