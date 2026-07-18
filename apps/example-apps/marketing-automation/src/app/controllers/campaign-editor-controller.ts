import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { EFLayoutDirection, FSelectionChangeEvent } from '@foblex/flow';
import {
  CampaignAddContext,
  CampaignFlowSnapshot,
  CampaignNodeRecord,
  createDefaultCampaign,
  ECampaignNodeType,
  ICampaignAddSlot,
} from '../domain';
import { CampaignLayoutCoordinator, ICampaignLayoutResult } from '../layout';
import { CampaignStorage } from '../persistence';
import { CampaignState } from '../state';

@Injectable()
export class CampaignEditorController {
  public readonly state = inject(CampaignState);

  private readonly _layout = inject(CampaignLayoutCoordinator);
  private readonly _storage = inject(CampaignStorage);
  private readonly _direction = signal(EFLayoutDirection.TOP_BOTTOM);
  private readonly _addSlots = signal<ICampaignAddSlot[]>([]);
  private readonly _isReady = signal(false);
  private readonly _isBusy = signal(false);

  public readonly direction = this._direction.asReadonly();
  public readonly addSlots = this._addSlots.asReadonly();
  public readonly isReady = this._isReady.asReadonly();
  public readonly isBusy = this._isBusy.asReadonly();
  public readonly nodes = this.state.nodes;
  public readonly connections = this.state.connections;
  public readonly transform = this.state.transform;

  public readonly selectedNode = computed<CampaignNodeRecord | null>(() => {
    const selectedId = this.state.selection().nodeIds[0];

    return this.nodes().find((node) => node.id === selectedId) ?? null;
  });

  public readonly canDeleteSelected = computed(() => {
    const selected = this.selectedNode();

    return selected ? this.state.canRemoveStep(selected.id) : false;
  });

  constructor() {
    effect(() => {
      this.state.changes();
      const direction = this._direction();
      if (!this._isReady()) {
        return;
      }

      this._storage.save({
        direction,
        snapshot: untracked(() => this.state.snapshot()),
      });
    });
  }

  public async initialize(): Promise<void> {
    const stored = this._storage.load();
    const direction = stored?.direction ?? EFLayoutDirection.TOP_BOTTOM;
    const snapshot = stored?.snapshot ?? createDefaultCampaign();
    const prepared = await this._prepareSnapshot(snapshot, direction);

    this._direction.set(direction);
    this.state.load(prepared.snapshot);
    this.state.clearHistory();
    this._addSlots.set(prepared.layout.addSlots);
    this._isReady.set(true);
  }

  public async insertStep(
    context: CampaignAddContext,
    type: ECampaignNodeType,
  ): Promise<string | null> {
    return this._mutateAndRelayout(() => this.state.insertStep(context, type));
  }

  public updateSelectedStep(
    patch: Partial<Pick<CampaignNodeRecord, 'title' | 'description' | 'detail'>>,
  ): void {
    const selected = this.selectedNode();
    if (selected) {
      this.state.updateStep(selected.id, patch);
    }
  }

  public selectNode(nodeId: string): void {
    this.state.applySelectionChange(new FSelectionChangeEvent([nodeId], [], []));
  }

  public clearSelection(): void {
    this.state.applySelectionChange(new FSelectionChangeEvent([], [], []));
  }

  public async deleteSelectedStep(): Promise<void> {
    const selected = this.selectedNode();
    if (!selected) {
      return;
    }

    await this._mutateAndRelayout(() => (this.state.removeStep(selected.id) ? selected.id : null));
  }

  public async undo(): Promise<void> {
    if (!this.state.canUndo() || this._isBusy()) {
      return;
    }

    this._isBusy.set(true);
    try {
      this.state.undo();
      await this._relayoutCurrent();
    } finally {
      this._isBusy.set(false);
    }
  }

  public async redo(): Promise<void> {
    if (!this.state.canRedo() || this._isBusy()) {
      return;
    }

    this._isBusy.set(true);
    try {
      this.state.redo();
      await this._relayoutCurrent();
    } finally {
      this._isBusy.set(false);
    }
  }

  public async setDirection(direction: EFLayoutDirection): Promise<void> {
    if (direction === this._direction() || this._isBusy()) {
      return;
    }

    this._isBusy.set(true);
    try {
      this._direction.set(direction);
      await this._relayoutCurrent();
    } finally {
      this._isBusy.set(false);
    }
  }

  public async reset(): Promise<void> {
    if (this._isBusy()) {
      return;
    }

    this._isBusy.set(true);
    try {
      this._storage.clear();
      const direction = EFLayoutDirection.TOP_BOTTOM;
      const prepared = await this._prepareSnapshot(createDefaultCampaign(), direction);
      this._direction.set(direction);
      this.state.load(prepared.snapshot);
      this.state.clearHistory();
      this._addSlots.set(prepared.layout.addSlots);
    } finally {
      this._isBusy.set(false);
    }
  }

  private async _mutateAndRelayout(work: () => string | null): Promise<string | null> {
    if (this._isBusy()) {
      return null;
    }

    this._isBusy.set(true);
    this.state.beginBatch();
    let changedId: string | null = null;
    try {
      changedId = work();
      if (changedId) {
        await this._relayoutCurrent();
      }
    } finally {
      this.state.endBatch();
      this._isBusy.set(false);
    }

    return changedId;
  }

  private async _relayoutCurrent(): Promise<void> {
    const layout = await this._layout.calculate(this.state.snapshot(), this._direction());
    this.state.applyLayout(layout.nodePositions);
    this._addSlots.set(layout.addSlots);
  }

  private async _prepareSnapshot(
    snapshot: CampaignFlowSnapshot,
    direction: EFLayoutDirection,
  ): Promise<{ snapshot: CampaignFlowSnapshot; layout: ICampaignLayoutResult }> {
    const layout = await this._layout.calculate(snapshot, direction);
    const positions = new Map(layout.nodePositions.map((item) => [item.id, item.position]));

    return {
      snapshot: {
        ...snapshot,
        nodes: snapshot.nodes.map((node) => ({
          ...node,
          position: positions.get(node.id) ?? node.position,
        })),
      },
      layout,
    };
  }
}
