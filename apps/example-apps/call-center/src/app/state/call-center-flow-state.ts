import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { FCreateNodeEvent, FFlowState } from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import {
  CallCenterConnectionRecord,
  CallCenterNodeRecord,
  CallCenterNodeValuePatch,
  ECallCenterNodeType,
  ICallCenterNode,
  ICallCenterNodeOutput,
  IUserInputNodeValue,
  createCallCenterNode,
  createDefaultCallCenterFlow,
  isCallCenterNodeType,
} from '../domain';
import { CallCenterFlowStorage } from '../persistence/call-center-flow-storage';

const POSITION_EPSILON = 0.001;

@Injectable()
export class CallCenterFlowState extends FFlowState<
  CallCenterNodeRecord,
  CallCenterConnectionRecord
> {
  private readonly _storage = inject(CallCenterFlowStorage);
  private readonly _flowId = signal('');

  public readonly canDeleteSelection = computed(() => {
    const selection = this.selection();

    return Boolean(
      selection.nodeIds.length + selection.groupIds.length + selection.connectionIds.length,
    );
  });

  constructor() {
    super();
    effect(() => {
      this.changes();
      const flowId = this._flowId();
      if (!flowId) {
        return;
      }

      this._storage.save(
        flowId,
        untracked(() => this.snapshot()),
      );
    });
  }

  public initialize(flowId: string): void {
    this._flowId.set(flowId);
    this.load(this._storage.load(flowId) ?? createDefaultCallCenterFlow());
  }

  public reset(): void {
    this._storage.clear(this._flowId());
    this.load(createDefaultCallCenterFlow());
  }

  public deleteSelection(): void {
    this.applyRemoval(this.selection());
  }

  public removeConnectionFromOutput(outputId: string): void {
    const connection = this.connections().find((item) => item.sourceId === outputId);
    if (connection) {
      this.removeConnections([connection.id]);
    }
  }

  public async setNodeExpanded(nodeId: string, isExpanded: boolean): Promise<void> {
    this.beginBatch();

    try {
      this.updateNode(nodeId, { isExpanded });
      await _afterResizeObserverTurn();
    } finally {
      this.endBatch();
    }
  }

  public updateNodeValue(nodeId: string, valuePatch: CallCenterNodeValuePatch): void {
    const shape = this.currentShape();
    const existing = shape.nodes[nodeId];
    if (!existing) {
      return;
    }

    const node = {
      ...existing,
      value: _mergeNodeValue(existing, valuePatch),
    } as CallCenterNodeRecord;
    let connections = shape.connections;

    if (_isUserInputNode(existing) && _isUserInputValue(valuePatch) && valuePatch.outputs != null) {
      const removedOutputs = existing.outputs.slice(valuePatch.outputs);
      node.outputs = _resizeOutputs(existing.outputs, valuePatch.outputs);
      connections = _removeConnectionsFromOutputs(connections, removedOutputs);
    }

    this.commit({
      ...shape,
      nodes: { ...shape.nodes, [nodeId]: node },
      connections,
    });
  }

  public override moveNodes(positions: { id: string; position: IPoint }[]): void {
    const changedPositions = positions.filter(({ id, position }) => {
      const item = this.getNode(id) ?? this.getGroup(id);

      return (
        item &&
        (Math.abs(item.position.x - position.x) >= POSITION_EPSILON ||
          Math.abs(item.position.y - position.y) >= POSITION_EPSILON)
      );
    });

    super.moveNodes(changedPositions);
  }

  protected override createNodeRecord(event: FCreateNodeEvent): CallCenterNodeRecord {
    if (!isCallCenterNodeType(event.data)) {
      throw new Error(`Unknown call center node type: ${String(event.data)}`);
    }

    return createCallCenterNode(event.data, {
      x: event.externalItemRect.x,
      y: event.externalItemRect.y,
    });
  }
}

function _afterResizeObserverTurn(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function _isUserInputNode(
  node: CallCenterNodeRecord,
): node is ICallCenterNode<ECallCenterNodeType.USER_INPUT> {
  return node.type === ECallCenterNodeType.USER_INPUT;
}

function _isUserInputValue(value: CallCenterNodeValuePatch): value is Partial<IUserInputNodeValue> {
  return value !== null && typeof value === 'object' && 'outputs' in value;
}

function _mergeNodeValue<TType extends ECallCenterNodeType>(
  existing: ICallCenterNode<TType>,
  valuePatch: CallCenterNodeValuePatch,
): ICallCenterNode<TType>['value'] {
  if (valuePatch === null || existing.value === null) {
    return valuePatch as ICallCenterNode<TType>['value'];
  }

  return { ...existing.value, ...valuePatch } as ICallCenterNode<TType>['value'];
}

function _resizeOutputs(existing: ICallCenterNodeOutput[], count: number): ICallCenterNodeOutput[] {
  if (count === existing.length) {
    return existing;
  }
  if (count < existing.length) {
    return existing.slice(0, count);
  }

  const result = [...existing];
  for (let index = existing.length; index < count; index++) {
    result.push({ id: generateGuid(), label: `Key ${index + 1}` });
  }

  return result;
}

function _removeConnectionsFromOutputs(
  connections: Record<string, CallCenterConnectionRecord>,
  outputs: ICallCenterNodeOutput[],
): Record<string, CallCenterConnectionRecord> {
  if (!outputs.length) {
    return connections;
  }

  const removedIds = new Set(outputs.map((output) => output.id));

  return Object.fromEntries(
    Object.entries(connections).filter(([, connection]) => !removedIds.has(connection.sourceId)),
  );
}
