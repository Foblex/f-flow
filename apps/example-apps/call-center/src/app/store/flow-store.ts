import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import {
  FCanvasChangeEvent,
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { IPoint, PointExtensions } from '@foblex/2d';
import {
  FlowStateNode,
  FlowStateNodePatch,
  FlowNodeValuePatch,
  IFlowStateNode,
  IFlowState,
  IFlowStateConnection,
  IUserInputNodeValue,
  NodeType,
  createIncomingCallNode,
  createPlayTextNode,
  createIvrNode,
  createConversationNode,
  createDisconnectNode,
  createCheckScheduleNode,
  createQueueCallNode,
  createTransferCallNode,
  createVoiceMailNode,
} from '../domain';

interface FlowStoreState {
  flowId: string;
  model: IFlowState | undefined;
}

function loadFromStorage(flowId: string): IFlowState | null {
  const raw = localStorage.getItem('flow' + flowId);

  return raw ? (JSON.parse(raw) as IFlowState) : null;
}

function saveToStorage(model: IFlowState, flowId: string): void {
  localStorage.setItem('flow' + flowId, JSON.stringify(model));
}

function createDefaultState(): IFlowState {
  const incomingCallNode = createIncomingCallNode(PointExtensions.initialize(0, 0));
  const checkScheduleNode = createCheckScheduleNode(PointExtensions.initialize(0, 100));
  const playTextNode = createPlayTextNode(PointExtensions.initialize(200, 250));
  const ivrNode = createIvrNode(PointExtensions.initialize(200, 400));
  const queueNode = createQueueCallNode(PointExtensions.initialize(200, 550));
  const operatorNode = createConversationNode(PointExtensions.initialize(200, 700));
  const voicemailNode = createVoiceMailNode(PointExtensions.initialize(-200, 250));
  const disconnectNode = createDisconnectNode(PointExtensions.initialize(-100, 700));

  const connections: Record<string, IFlowStateConnection> = {};

  function connect(sourceOutputId: string, targetInputId: string): void {
    const id = generateGuid();
    connections[id] = { id, source: sourceOutputId, target: targetInputId };
  }

  // Incoming -> CheckSchedule
  connect(incomingCallNode.outputs[0].id, getNodeInputId(checkScheduleNode));
  // CheckSchedule (working hours) -> PlayText
  connect(checkScheduleNode.outputs[0].id, getNodeInputId(playTextNode));
  // CheckSchedule (after hours) -> Voicemail
  connect(checkScheduleNode.outputs[1].id, getNodeInputId(voicemailNode));
  // PlayText -> IVR
  connect(playTextNode.outputs[0].id, getNodeInputId(ivrNode));
  // IVR (Key 1) -> Queue
  connect(ivrNode.outputs[0].id, getNodeInputId(queueNode));
  // Queue (Answered) -> Operator
  connect(queueNode.outputs[0].id, getNodeInputId(operatorNode));
  // Queue (Timeout) -> Disconnect
  connect(queueNode.outputs[1].id, getNodeInputId(disconnectNode));
  // Voicemail -> Disconnect
  connect(voicemailNode.outputs[0].id, getNodeInputId(disconnectNode));

  playTextNode.value = {
    text: 'Welcome to our support line. Press 1 for sales, press 2 for support, press 3 for billing.',
  };

  return {
    nodes: {
      [incomingCallNode.id]: incomingCallNode,
      [checkScheduleNode.id]: checkScheduleNode,
      [playTextNode.id]: playTextNode,
      [ivrNode.id]: ivrNode,
      [queueNode.id]: queueNode,
      [operatorNode.id]: operatorNode,
      [voicemailNode.id]: voicemailNode,
      [disconnectNode.id]: disconnectNode,
    },
    connections,
  };
}

function getNodeInputId(node: FlowStateNode): string {
  if (!node.input) {
    throw new Error(`Node "${node.type}" does not expose an input connector.`);
  }

  return node.input;
}

function isUserInputNode(node: FlowStateNode): node is IFlowStateNode<NodeType.USER_INPUT> {
  return node.type === NodeType.USER_INPUT;
}

function isUserInputValue(
  value: FlowStateNodePatch['value'],
): value is Partial<IUserInputNodeValue> {
  return value !== null && typeof value === 'object' && 'outputs' in value;
}

function mergeNodeValue<TType extends NodeType>(
  existing: IFlowStateNode<TType>,
  nextValue?: FlowNodeValuePatch,
): IFlowStateNode<TType>['value'] {
  if (nextValue === undefined) {
    return existing.value;
  }

  if (existing.value === null || nextValue === null) {
    return nextValue as IFlowStateNode<TType>['value'];
  }

  return { ...existing.value, ...nextValue } as IFlowStateNode<TType>['value'];
}

function createNodeByType(type: string, position: IPoint): FlowStateNode {
  switch (type) {
    case NodeType.INCOMING_CALL:
      return createIncomingCallNode(position);
    case NodeType.PLAY_TEXT:
      return createPlayTextNode(position);
    case NodeType.USER_INPUT:
      return createIvrNode(position);
    case NodeType.TO_OPERATOR:
      return createConversationNode(position);
    case NodeType.DISCONNECT:
      return createDisconnectNode(position);
    case NodeType.CHECK_SCHEDULE:
      return createCheckScheduleNode(position);
    case NodeType.QUEUE_CALL:
      return createQueueCallNode(position);
    case NodeType.TRANSFER_CALL:
      return createTransferCallNode(position);
    case NodeType.VOICE_MAIL:
      return createVoiceMailNode(position);
    default:
      throw new Error('Unknown node type');
  }
}

function resizeOutputs(
  existing: FlowStateNode['outputs'],
  count: number,
): FlowStateNode['outputs'] {
  if (count === existing.length) return existing;
  if (count < existing.length) return existing.slice(0, count);

  const result = [...existing];
  for (let i = existing.length; i < count; i++) {
    result.push({ id: generateGuid(), label: `Key ${i + 1}` });
  }

  return result;
}

function findConnectionsForNode(
  node: FlowStateNode,
  connections: IFlowStateConnection[],
): string[] {
  const result: string[] = [];
  result.push(...connections.filter((c) => c.target === node.input).map((c) => c.id));
  const outputIds = node.outputs.map((o) => o.id);
  result.push(...connections.filter((c) => outputIds.includes(c.source)).map((c) => c.id));

  return result;
}

export const FlowStore = signalStore(
  withState<FlowStoreState>({
    flowId: '',
    model: undefined,
  }),

  withComputed((state) => ({
    nodes: computed(() => Object.values(state.model()?.nodes || {})),
    connections: computed(() => Object.values(state.model()?.connections || {})),
    canRemove: computed(() => {
      const m = state.model();
      if (!m?.selection) return false;

      return m.selection.nodes.length + m.selection.connections.length > 0;
    }),
  })),

  withMethods((store) => ({
    initialize(flowId: string): void {
      const model = loadFromStorage(flowId) || createDefaultState();
      patchState(store, { flowId, model });
    },

    resetFlow(): void {
      localStorage.removeItem('flow' + store.flowId());
      const model = createDefaultState();
      patchState(store, { model });
    },

    transformCanvas(event: FCanvasChangeEvent): void {
      const model = store.model();
      if (!model) return;
      const updated = { ...model, transform: { position: event.position, scale: event.scale } };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    createNode(event: FCreateNodeEvent): void {
      const model = store.model();
      if (!model) return;
      const node = createNodeByType(event.data, event.rect);
      const updated: IFlowState = {
        ...model,
        nodes: { ...model.nodes, [node.id]: node },
        selection: { nodes: [node.id], connections: [] },
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    moveNodes(event: FMoveNodesEvent): void {
      const model = store.model();
      if (!model) return;
      const updatedNodes = { ...model.nodes };
      for (const { id, position } of event.fNodes) {
        updatedNodes[id] = { ...updatedNodes[id], position };
      }
      const updated = { ...model, nodes: updatedNodes };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    createConnection(event: FCreateConnectionEvent): void {
      const model = store.model();
      if (!model || !event.fInputId) return;
      const connection: IFlowStateConnection = {
        id: generateGuid(),
        source: event.fOutputId,
        target: event.fInputId,
      };
      const updated: IFlowState = {
        ...model,
        connections: { ...model.connections, [connection.id]: connection },
        selection: { nodes: [], connections: [connection.id] },
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    reassignConnection(event: FReassignConnectionEvent): void {
      const model = store.model();
      if (!model || !event.newTargetId) return;
      const existing = model.connections[event.connectionId];
      if (!existing) return;
      const updated: IFlowState = {
        ...model,
        connections: {
          ...model.connections,
          [event.connectionId]: { ...existing, target: event.newTargetId },
        },
        selection: { nodes: [], connections: [event.connectionId] },
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    changeSelection(event: FSelectionChangeEvent): void {
      const model = store.model();
      if (!model) return;
      const updated: IFlowState = {
        ...model,
        selection: { nodes: [...event.fNodeIds], connections: [...event.fConnectionIds] },
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    selectAll(): void {
      const model = store.model();
      if (!model) return;
      const updated: IFlowState = {
        ...model,
        selection: {
          nodes: Object.keys(model.nodes),
          connections: Object.keys(model.connections),
        },
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    removeConnectionByOutput(outputId: string): void {
      const model = store.model();
      if (!model) return;
      const conn = Object.values(model.connections).find((c) => c.source === outputId);
      if (!conn) return;
      const { [conn.id]: _, ...remainingConnections } = model.connections;
      const updated = { ...model, connections: remainingConnections };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    removeSelected(): void {
      const model = store.model();
      if (!model) return;
      const selectedNodeIds = model.selection?.nodes ?? [];
      const selectedConnIds = model.selection?.connections ?? [];
      if (!selectedConnIds.length && !selectedNodeIds.length) return;

      const connIdsToDelete = new Set<string>(selectedConnIds);
      const allConnections = Object.values(model.connections);
      for (const nodeId of selectedNodeIds) {
        const node = model.nodes[nodeId];
        if (!node) continue;
        findConnectionsForNode(node, allConnections).forEach((cid) => connIdsToDelete.add(cid));
      }

      const remainingNodes = { ...model.nodes };
      for (const id of selectedNodeIds) {
        delete remainingNodes[id];
      }

      const remainingConns = { ...model.connections };
      for (const id of connIdsToDelete) {
        delete remainingConns[id];
      }

      const updated: IFlowState = {
        ...model,
        nodes: remainingNodes,
        connections: remainingConns,
        selection: undefined,
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },

    updateNode(nodeId: string, value: FlowStateNodePatch): void {
      const model = store.model();
      if (!model) return;
      const existing = model.nodes[nodeId];
      if (!existing) return;

      const merged = {
        ...existing,
        ...value,
        value: mergeNodeValue(existing, value.value),
      } as FlowStateNode;
      let connections = model.connections;

      if (
        isUserInputNode(existing) &&
        isUserInputValue(value.value) &&
        value.value.outputs != null
      ) {
        const newCount = value.value.outputs;
        const removedOutputs = existing.outputs.slice(newCount);
        merged.outputs = resizeOutputs(existing.outputs, newCount);

        if (removedOutputs.length > 0) {
          const removedIds = new Set(removedOutputs.map((o) => o.id));
          const filtered: Record<string, IFlowStateConnection> = {};
          for (const [id, conn] of Object.entries(connections)) {
            if (!removedIds.has(conn.source)) {
              filtered[id] = conn;
            }
          }
          connections = filtered;
        }
      }

      const updated: IFlowState = {
        ...model,
        nodes: { ...model.nodes, [nodeId]: merged },
        connections,
      };
      patchState(store, { model: updated });
      saveToStorage(updated, store.flowId());
    },
  })),
);
