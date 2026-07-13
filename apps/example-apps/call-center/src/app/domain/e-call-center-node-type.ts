export enum ECallCenterNodeType {
  INCOMING_CALL = 'incoming-call',
  PLAY_TEXT = 'play-text',
  USER_INPUT = 'user-input',
  TO_OPERATOR = 'to-operator',
  DISCONNECT = 'disconnect',
  CHECK_SCHEDULE = 'check-schedule',
  QUEUE_CALL = 'queue-call',
  VOICEMAIL = 'voice-mail',
  TRANSFER_CALL = 'transfer-call',
}

const CALL_CENTER_NODE_TYPES = new Set<string>(Object.values(ECallCenterNodeType));

export function isCallCenterNodeType(value: unknown): value is ECallCenterNodeType {
  return typeof value === 'string' && CALL_CENTER_NODE_TYPES.has(value);
}
