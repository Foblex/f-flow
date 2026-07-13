import { ECallCenterNodeType } from './e-call-center-node-type';

export interface ICallCenterNodeMetadata {
  name: string;
  icon: string;
  color: string;
  isExpandable: boolean;
}

export const CALL_CENTER_NODE_METADATA: Record<ECallCenterNodeType, ICallCenterNodeMetadata> = {
  [ECallCenterNodeType.INCOMING_CALL]: {
    name: 'Incoming call',
    icon: 'ring_volume',
    color: 'var(--node-color-incoming)',
    isExpandable: false,
  },
  [ECallCenterNodeType.CHECK_SCHEDULE]: {
    name: 'Check schedule',
    icon: 'schedule',
    color: 'var(--node-color-schedule)',
    isExpandable: true,
  },
  [ECallCenterNodeType.PLAY_TEXT]: {
    name: 'Play text',
    icon: 'record_voice_over',
    color: 'var(--node-color-playtext)',
    isExpandable: true,
  },
  [ECallCenterNodeType.USER_INPUT]: {
    name: 'IVR',
    icon: 'dialpad',
    color: 'var(--node-color-userinput)',
    isExpandable: true,
  },
  [ECallCenterNodeType.QUEUE_CALL]: {
    name: 'Queue',
    icon: 'group',
    color: 'var(--node-color-queue)',
    isExpandable: true,
  },
  [ECallCenterNodeType.TO_OPERATOR]: {
    name: 'To operator',
    icon: 'support_agent',
    color: 'var(--node-color-operator)',
    isExpandable: true,
  },
  [ECallCenterNodeType.TRANSFER_CALL]: {
    name: 'Transfer',
    icon: 'phone_forwarded',
    color: 'var(--node-color-transfer)',
    isExpandable: true,
  },
  [ECallCenterNodeType.VOICEMAIL]: {
    name: 'Voicemail',
    icon: 'voicemail',
    color: 'var(--node-color-voicemail)',
    isExpandable: true,
  },
  [ECallCenterNodeType.DISCONNECT]: {
    name: 'Disconnect',
    icon: 'call_end',
    color: 'var(--node-color-disconnect)',
    isExpandable: false,
  },
};
