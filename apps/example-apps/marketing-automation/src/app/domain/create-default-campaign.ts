import { campaignInputId } from './campaign-connectors';
import { CampaignFlowSnapshot } from './campaign-flow-snapshot';
import { createCampaignNode } from './create-campaign-node';
import { ECampaignNodeType } from './e-campaign-node-type';
import { CampaignConnectionRecord } from './i-campaign-connection';
import { CampaignNodeRecord } from './i-campaign-node';

export function createDefaultCampaign(): CampaignFlowSnapshot {
  const trigger = createCampaignNode(ECampaignNodeType.TRIGGER, 'trigger', {
    title: 'Abandoned cart audience',
    description: 'Customers with a cart value above $80 and no purchase.',
    detail: 'High-intent shoppers',
  });
  const email = createCampaignNode(ECampaignNodeType.EMAIL, 'email-reminder', {
    title: 'Your cart is waiting',
    description: 'A personalized reminder with the saved cart contents.',
    detail: 'Cart reminder / A/B',
  });
  const condition = createCampaignNode(ECampaignNodeType.CONDITION, 'condition-opened', {
    title: 'Email opened?',
    description: 'Continue based on engagement during the next day.',
    detail: 'Within 24 hours',
  });
  const sms = createCampaignNode(ECampaignNodeType.SMS, 'sms-offer', {
    title: 'Send a personal offer',
    description: 'Share a time-limited incentive with engaged customers.',
    detail: '10% off / 160 chars',
  });
  const goal = createCampaignNode(ECampaignNodeType.GOAL, 'goal-purchase', {
    title: 'Purchase completed',
    description: 'Customer placed an order after entering the journey.',
    detail: 'Revenue goal',
  });
  const finalEmail = createCampaignNode(ECampaignNodeType.EMAIL, 'email-final', {
    title: 'Last chance reminder',
    description: 'Send the final reminder before ending the campaign.',
    detail: 'Final notice',
  });
  const nodes = [trigger, email, condition, sms, goal, finalEmail];
  const connections = [
    connect('trigger-email', trigger, 'next', email),
    connect('email-condition', email, 'next', condition),
    connect('condition-sms', condition, 'yes', sms, 'Yes'),
    connect('sms-goal', sms, 'next', goal),
    connect('condition-final-email', condition, 'no', finalEmail, 'No'),
  ];

  return { nodes, groups: [], connections };
}

function connect(
  id: string,
  source: CampaignNodeRecord,
  outputKey: string,
  target: CampaignNodeRecord,
  label?: string,
): CampaignConnectionRecord {
  const output = source.outputs.find((item) => item.key === outputKey);
  if (!output) {
    throw new Error(`Output ${outputKey} not found on campaign node ${source.id}.`);
  }

  return {
    id,
    sourceId: output.id,
    targetId: campaignInputId(target.id),
    sourceNodeId: source.id,
    targetNodeId: target.id,
    label,
  };
}
