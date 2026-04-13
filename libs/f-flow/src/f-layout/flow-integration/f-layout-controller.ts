import { DestroyRef, inject, Injectable } from '@angular/core';
import { PointExtensions } from '@foblex/2d';
import { EFLayoutMode } from '../enums';
import { FLayoutEngine } from '../f-layout-engine';
import { IFLayoutNodePosition } from '../models';
import { FComponentsStore } from '../../f-storage';
import { FFlowBase } from '../../f-flow';
import { normalizeFlowLayoutData } from './normalize-flow-layout-data';

const FLOW_LAYOUT_DEBOUNCE_MS = 1;

interface IFlowRegistration {
  flow: FFlowBase;
  store: FComponentsStore;
  nodeSignature: string;
  connectionSignature: string;
  timeoutId: ReturnType<typeof setTimeout> | null;
  raf1: number | null;
  raf2: number | null;
  unsubs: (() => void)[];
  runId: number;
  isApplying: boolean;
}

@Injectable()
export class FLayoutController {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _flows = new Map<string, IFlowRegistration>();

  private _engine?: FLayoutEngine;

  constructor() {
    this._destroyRef.onDestroy(() => {
      Array.from(this._flows.keys()).forEach((flowId) => this.unregisterFlow(flowId));
      this._engine = undefined;
    });
  }

  public attachEngine(engine: FLayoutEngine): void {
    this._engine = engine;
  }

  public registerFlow(flow: FFlowBase, store: FComponentsStore): void {
    const flowId = flow.fId();

    this.unregisterFlow(flowId);

    const registration: IFlowRegistration = {
      flow,
      store,
      nodeSignature: this._buildNodeSignature(store),
      connectionSignature: this._buildConnectionSignature(store),
      timeoutId: null,
      raf1: null,
      raf2: null,
      unsubs: [],
      runId: 0,
      isApplying: false,
    };

    registration.unsubs.push(
      store.nodesChanges$.listen(() => this._handleNodesChanges(flowId)),
      store.connectionsChanges$.listen(() => this._handleConnectionsChanges(flowId)),
    );

    this._flows.set(flowId, registration);

    if (this._engine?.getMode() === EFLayoutMode.AUTO) {
      this._scheduleRelayout(flowId);
    }
  }

  public unregisterFlow(flowId: string): void {
    const registration = this._flows.get(flowId);

    if (!registration) {
      return;
    }

    registration.unsubs.forEach((unsub) => unsub());
    this._clearScheduledWork(registration);
    this._flows.delete(flowId);
  }

  public handleModeChanged(mode: EFLayoutMode): void {
    if (mode !== EFLayoutMode.AUTO) {
      return;
    }

    for (const flowId of this._flows.keys()) {
      this._scheduleRelayout(flowId);
    }
  }

  public async relayout(flowId?: string): Promise<void> {
    if (!this._engine) {
      return;
    }

    if (flowId) {
      const registration = this._flows.get(flowId);

      if (registration) {
        await this._relayoutRegisteredFlow(flowId, registration);
      }

      return;
    }

    for (const [id, registration] of this._flows.entries()) {
      await this._relayoutRegisteredFlow(id, registration);
    }
  }

  private _handleNodesChanges(flowId: string): void {
    const registration = this._flows.get(flowId);

    if (!registration || registration.isApplying) {
      return;
    }

    const nextSignature = this._buildNodeSignature(registration.store);

    if (nextSignature === registration.nodeSignature) {
      return;
    }

    registration.nodeSignature = nextSignature;
    this._scheduleRelayout(flowId);
  }

  private _handleConnectionsChanges(flowId: string): void {
    const registration = this._flows.get(flowId);

    if (!registration || registration.isApplying) {
      return;
    }

    const nextSignature = this._buildConnectionSignature(registration.store);

    if (nextSignature === registration.connectionSignature) {
      return;
    }

    registration.connectionSignature = nextSignature;
    this._scheduleRelayout(flowId);
  }

  private _scheduleRelayout(flowId: string): void {
    const registration = this._flows.get(flowId);

    if (!registration || !this._engine || this._engine.getMode() !== EFLayoutMode.AUTO) {
      return;
    }

    if (registration.timeoutId !== null) {
      clearTimeout(registration.timeoutId);
    }

    this._cancelAnimationFrames(registration);
    registration.timeoutId = setTimeout(() => {
      registration.timeoutId = null;
      this._runAfterNextPaint(registration, () => void this._relayoutFlowIfReady(flowId));
    }, FLOW_LAYOUT_DEBOUNCE_MS);
  }

  private async _relayoutFlowIfReady(flowId: string): Promise<void> {
    const registration = this._flows.get(flowId);

    if (!registration || !this._engine || this._engine.getMode() !== EFLayoutMode.AUTO) {
      return;
    }

    if (registration.store.hasPendingProgressiveRender) {
      this._scheduleRelayout(flowId);

      return;
    }

    await this._relayoutRegisteredFlow(flowId, registration);
  }

  private async _relayoutRegisteredFlow(
    flowId: string,
    registration: IFlowRegistration,
  ): Promise<void> {
    if (!this._engine) {
      return;
    }

    const graph = normalizeFlowLayoutData(registration.flow.getState({ measuredSize: true }));
    const runId = ++registration.runId;
    const result = await this._engine.calculate(graph.nodes, graph.connections, {
      flowId,
      mode: this._engine.getMode(),
    });
    const nextRegistration = this._flows.get(flowId);

    if (!nextRegistration || nextRegistration.runId !== runId) {
      return;
    }

    const changedNodes = this._applyPositions(nextRegistration.store, result.nodes);

    if (!changedNodes.length) {
      return;
    }

    nextRegistration.isApplying = true;

    try {
      nextRegistration.flow.redraw();
      this._emitWriteback(flowId, result.nodes, graph.nodeIds, graph.groupIds);
    } finally {
      queueMicrotask(() => {
        const current = this._flows.get(flowId);

        if (current) {
          current.isApplying = false;
        }
      });
    }
  }

  private _emitWriteback(
    flowId: string,
    nodes: IFLayoutNodePosition[],
    nodeIds: Set<string>,
    groupIds: Set<string>,
  ): void {
    const handler = this._engine?.getWriteback();

    if (!handler) {
      return;
    }

    handler({
      flowId,
      nodes: nodes.filter((node) => nodeIds.has(node.id)),
      groups: nodes.filter((node) => groupIds.has(node.id)),
    });
  }

  private _applyPositions(
    store: FComponentsStore,
    nodes: IFLayoutNodePosition[],
  ): IFLayoutNodePosition[] {
    return nodes.filter((node) => {
      const registeredNode = store.nodes.get(node.id);

      if (!registeredNode || PointExtensions.isEqual(registeredNode._position, node.position)) {
        return false;
      }

      registeredNode.position.set({ ...node.position });

      return true;
    });
  }

  private _buildNodeSignature(store: FComponentsStore): string {
    return store.nodes
      .getAll()
      .map((node) => node.fId())
      .sort()
      .join('|');
  }

  private _buildConnectionSignature(store: FComponentsStore): string {
    return store.connections
      .getAll()
      .map((connection) => `${connection.fId()}:${connection.fOutputId()}:${connection.fInputId()}`)
      .sort()
      .join('|');
  }

  private _runAfterNextPaint(registration: IFlowRegistration, callback: () => void): void {
    this._cancelAnimationFrames(registration);

    if (typeof requestAnimationFrame !== 'function') {
      callback();

      return;
    }

    registration.raf1 = requestAnimationFrame(() => {
      registration.raf1 = null;
      registration.raf2 = requestAnimationFrame(() => {
        registration.raf2 = null;
        callback();
      });
    });
  }

  private _clearScheduledWork(registration: IFlowRegistration): void {
    if (registration.timeoutId !== null) {
      clearTimeout(registration.timeoutId);
      registration.timeoutId = null;
    }

    this._cancelAnimationFrames(registration);
  }

  private _cancelAnimationFrames(registration: IFlowRegistration): void {
    if (registration.raf1 !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(registration.raf1);
      registration.raf1 = null;
    }

    if (registration.raf2 !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(registration.raf2);
      registration.raf2 = null;
    }
  }
}
