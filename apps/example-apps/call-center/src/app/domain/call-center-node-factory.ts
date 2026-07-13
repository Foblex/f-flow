import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { ECallCenterNodeType } from './e-call-center-node-type';
import { CallCenterNodeRecord, ICallCenterNode } from './i-call-center-node';

export function createCallCenterNode(
  type: ECallCenterNodeType,
  position: IPoint,
): CallCenterNodeRecord {
  switch (type) {
    case ECallCenterNodeType.INCOMING_CALL:
      return createIncomingCallNode(position);
    case ECallCenterNodeType.CHECK_SCHEDULE:
      return createCheckScheduleNode(position);
    case ECallCenterNodeType.PLAY_TEXT:
      return createPlayTextNode(position);
    case ECallCenterNodeType.USER_INPUT:
      return createIvrNode(position);
    case ECallCenterNodeType.QUEUE_CALL:
      return createQueueCallNode(position);
    case ECallCenterNodeType.TO_OPERATOR:
      return createOperatorNode(position);
    case ECallCenterNodeType.TRANSFER_CALL:
      return createTransferCallNode(position);
    case ECallCenterNodeType.VOICEMAIL:
      return createVoicemailNode(position);
    case ECallCenterNodeType.DISCONNECT:
      return createDisconnectNode(position);
  }
}

export function createIncomingCallNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.INCOMING_CALL> {
  return {
    id: generateGuid(),
    outputs: [{ id: generateGuid(), label: '' }],
    position,
    type: ECallCenterNodeType.INCOMING_CALL,
    value: null,
  };
}

export function createCheckScheduleNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.CHECK_SCHEDULE> {
  return {
    id: generateGuid(),
    description: 'Business hours check',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Working hours' },
      { id: generateGuid(), label: 'After hours' },
    ],
    position,
    type: ECallCenterNodeType.CHECK_SCHEDULE,
    value: { startTime: '09:00', endTime: '18:00', timezone: 'UTC', weekends: false },
  };
}

export function createPlayTextNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.PLAY_TEXT> {
  return {
    id: generateGuid(),
    description: 'Text-to-speech',
    input: generateGuid(),
    outputs: [{ id: generateGuid(), label: 'Done' }],
    position,
    type: ECallCenterNodeType.PLAY_TEXT,
    value: { text: '' },
  };
}

export function createIvrNode(position: IPoint): ICallCenterNode<ECallCenterNodeType.USER_INPUT> {
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
    type: ECallCenterNodeType.USER_INPUT,
    value: { outputs: 3, timeout: 5 },
  };
}

export function createQueueCallNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.QUEUE_CALL> {
  return {
    id: generateGuid(),
    description: 'Call queue',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Answered' },
      { id: generateGuid(), label: 'Timeout' },
    ],
    position,
    type: ECallCenterNodeType.QUEUE_CALL,
    value: { queueName: 'default', maxWaitTime: 300, priority: 'normal', musicOnHold: true },
  };
}

export function createOperatorNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.TO_OPERATOR> {
  return {
    id: generateGuid(),
    description: 'Operator transfer',
    input: generateGuid(),
    outputs: [{ id: generateGuid(), label: 'Call ended' }],
    position,
    type: ECallCenterNodeType.TO_OPERATOR,
    value: { department: 'general', skillLevel: 'any' },
  };
}

export function createTransferCallNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.TRANSFER_CALL> {
  return {
    id: generateGuid(),
    description: 'External transfer',
    input: generateGuid(),
    outputs: [
      { id: generateGuid(), label: 'Answered' },
      { id: generateGuid(), label: 'No answer' },
    ],
    position,
    type: ECallCenterNodeType.TRANSFER_CALL,
    value: { phoneNumber: '', ringTimeout: 30 },
  };
}

export function createVoicemailNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.VOICEMAIL> {
  return {
    id: generateGuid(),
    description: 'Record voicemail',
    input: generateGuid(),
    outputs: [{ id: generateGuid(), label: 'Recorded' }],
    position,
    type: ECallCenterNodeType.VOICEMAIL,
    value: { greeting: 'Please leave a message after the beep.', maxDuration: 120 },
  };
}

export function createDisconnectNode(
  position: IPoint,
): ICallCenterNode<ECallCenterNodeType.DISCONNECT> {
  return {
    id: generateGuid(),
    input: generateGuid(),
    outputs: [],
    position,
    type: ECallCenterNodeType.DISCONNECT,
    value: null,
  };
}
