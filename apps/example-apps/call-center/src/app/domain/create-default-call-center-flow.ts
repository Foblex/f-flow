import { PointExtensions } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { CallCenterConnectionRecord } from './call-center-connection';
import { CallCenterFlowSnapshot } from './call-center-flow-snapshot';
import {
  createCheckScheduleNode,
  createDisconnectNode,
  createIncomingCallNode,
  createIvrNode,
  createOperatorNode,
  createPlayTextNode,
  createQueueCallNode,
  createVoicemailNode,
} from './call-center-node-factory';
import { CallCenterNodeRecord } from './i-call-center-node';

export function createDefaultCallCenterFlow(): CallCenterFlowSnapshot {
  const incomingCallNode = createIncomingCallNode(PointExtensions.initialize(0, 0));
  const checkScheduleNode = createCheckScheduleNode(PointExtensions.initialize(0, 100));
  const playTextNode = createPlayTextNode(PointExtensions.initialize(200, 250));
  const ivrNode = createIvrNode(PointExtensions.initialize(200, 400));
  const queueNode = createQueueCallNode(PointExtensions.initialize(200, 550));
  const operatorNode = createOperatorNode(PointExtensions.initialize(200, 700));
  const voicemailNode = createVoicemailNode(PointExtensions.initialize(-200, 250));
  const disconnectNode = createDisconnectNode(PointExtensions.initialize(-100, 700));
  const connections: CallCenterConnectionRecord[] = [];

  _connect(connections, incomingCallNode.outputs[0].id, _getInputId(checkScheduleNode));
  _connect(connections, checkScheduleNode.outputs[0].id, _getInputId(playTextNode));
  _connect(connections, checkScheduleNode.outputs[1].id, _getInputId(voicemailNode));
  _connect(connections, playTextNode.outputs[0].id, _getInputId(ivrNode));
  _connect(connections, ivrNode.outputs[0].id, _getInputId(queueNode));
  _connect(connections, queueNode.outputs[0].id, _getInputId(operatorNode));
  _connect(connections, queueNode.outputs[1].id, _getInputId(disconnectNode));
  _connect(connections, voicemailNode.outputs[0].id, _getInputId(disconnectNode));

  playTextNode.value = {
    text: 'Welcome to our support line. Press 1 for sales, press 2 for support, press 3 for billing.',
  };

  return {
    nodes: [
      incomingCallNode,
      checkScheduleNode,
      playTextNode,
      ivrNode,
      queueNode,
      operatorNode,
      voicemailNode,
      disconnectNode,
    ],
    groups: [],
    connections,
  };
}

function _connect(
  connections: CallCenterConnectionRecord[],
  sourceId: string,
  targetId: string,
): void {
  connections.push({ id: generateGuid(), sourceId, targetId });
}

function _getInputId(node: CallCenterNodeRecord): string {
  if (!node.input) {
    throw new Error(`Node "${node.type}" does not expose an input connector.`);
  }

  return node.input;
}
