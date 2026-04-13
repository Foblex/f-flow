import { NodeType } from './node-type';

interface INodeParams {
  name: string;
  icon: string;
  color: string;
  isExpandable: boolean;
}

export const NODE_PARAMS_MAP: Record<NodeType, INodeParams> = {
  [NodeType.INCOMING_CALL]: {
    name: 'Incoming call',
    icon: 'ring_volume',
    color: 'var(--node-color-incoming)',
    isExpandable: false,
  },
  [NodeType.CHECK_SCHEDULE]: {
    name: 'Check schedule',
    icon: 'schedule',
    color: 'var(--node-color-schedule)',
    isExpandable: true,
  },
  [NodeType.PLAY_TEXT]: {
    name: 'Play text',
    icon: 'record_voice_over',
    color: 'var(--node-color-playtext)',
    isExpandable: true,
  },
  [NodeType.USER_INPUT]: {
    name: 'IVR',
    icon: 'dialpad',
    color: 'var(--node-color-userinput)',
    isExpandable: true,
  },
  [NodeType.QUEUE_CALL]: {
    name: 'Queue',
    icon: 'group',
    color: 'var(--node-color-queue)',
    isExpandable: true,
  },
  [NodeType.TO_OPERATOR]: {
    name: 'To operator',
    icon: 'support_agent',
    color: 'var(--node-color-operator)',
    isExpandable: true,
  },
  [NodeType.TRANSFER_CALL]: {
    name: 'Transfer',
    icon: 'phone_forwarded',
    color: 'var(--node-color-transfer)',
    isExpandable: true,
  },
  [NodeType.VOICE_MAIL]: {
    name: 'Voicemail',
    icon: 'voicemail',
    color: 'var(--node-color-voicemail)',
    isExpandable: true,
  },
  [NodeType.DISCONNECT]: {
    name: 'Disconnect',
    icon: 'call_end',
    color: 'var(--node-color-disconnect)',
    isExpandable: false,
  },
};
