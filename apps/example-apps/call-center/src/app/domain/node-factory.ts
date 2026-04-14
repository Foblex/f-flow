import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { NodeType } from './node-type';
import { IFlowStateNode } from './i-flow-state-node';

export function createIncomingCallNode(position: IPoint): IFlowStateNode<NodeType.INCOMING_CALL> {
  return {
    id: generateGuid(),
    outputs: [{ id: generateGuid(), label: '' }],
    position,
    type: NodeType.INCOMING_CALL,
    value: null,
  };
}

export function createCheckScheduleNode(position: IPoint): IFlowStateNode<NodeType.CHECK_SCHEDULE> {
  return {
    id: generateGuid(),
    description: 'Business hours check',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Working hours' },
      { id: generateGuid(), label: 'After hours' },
    ],
    position,
    type: NodeType.CHECK_SCHEDULE,
    value: { startTime: '09:00', endTime: '18:00', timezone: 'UTC', weekends: false },
  };
}

export function createPlayTextNode(position: IPoint): IFlowStateNode<NodeType.PLAY_TEXT> {
  return {
    id: generateGuid(),
    description: 'Text-to-speech',
    input: generateGuid(),
    outputs: [{ id: generateGuid(), label: 'Done' }],
    position,
    type: NodeType.PLAY_TEXT,
    value: { text: '' },
  };
}

export function createIvrNode(position: IPoint): IFlowStateNode<NodeType.USER_INPUT> {
  return {
    id: generateGuid(),
    description: 'Digit input',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Key 1' },
      { id: generateGuid(), label: 'Key 2' },
      { id: generateGuid(), label: 'Key 3' },
    ],
    position,
    type: NodeType.USER_INPUT,
    value: { outputs: 3, timeout: 5 },
  };
}

export function createQueueCallNode(position: IPoint): IFlowStateNode<NodeType.QUEUE_CALL> {
  return {
    id: generateGuid(),
    description: 'Call queue',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Answered' },
      { id: generateGuid(), label: 'Timeout' },
    ],
    position,
    type: NodeType.QUEUE_CALL,
    value: { queueName: 'default', maxWaitTime: 300, priority: 'normal', musicOnHold: true },
  };
}

export function createConversationNode(position: IPoint): IFlowStateNode<NodeType.TO_OPERATOR> {
  return {
    id: generateGuid(),
    description: 'Operator transfer',
    input: generateGuid(),
    outputs: [{ id: generateGuid(), label: 'Call ended' }],
    position,
    type: NodeType.TO_OPERATOR,
    value: { department: 'general', skillLevel: 'any' },
  };
}

export function createTransferCallNode(position: IPoint): IFlowStateNode<NodeType.TRANSFER_CALL> {
  return {
    id: generateGuid(),
    description: 'External transfer',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Answered' },
      { id: generateGuid(), label: 'No answer' },
    ],
    position,
    type: NodeType.TRANSFER_CALL,
    value: { phoneNumber: '', ringTimeout: 30 },
  };
}

export function createVoiceMailNode(position: IPoint): IFlowStateNode<NodeType.VOICE_MAIL> {
  return {
    id: generateGuid(),
    description: 'Record voicemail',
    input: generateGuid(),
    outputs: [{ id: generateGuid(), label: 'Recorded' }],
    position,
    type: NodeType.VOICE_MAIL,
    value: { greeting: 'Please leave a message after the beep.', maxDuration: 120 },
  };
}

export function createDisconnectNode(position: IPoint): IFlowStateNode<NodeType.DISCONNECT> {
  return {
    id: generateGuid(),
    input: generateGuid(),
    outputs: [],
    position,
    type: NodeType.DISCONNECT,
    value: null,
  };
}
