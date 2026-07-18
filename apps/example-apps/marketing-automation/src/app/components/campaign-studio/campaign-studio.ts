import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  EFConnectableSide,
  EFLayoutDirection,
  EFLayoutMode,
  F_DEFAULT_CONTROL_SCHEME,
  FCanvasChangeEvent,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FSelectionChangeEvent,
  FFlowState,
  FZoomDirective,
  provideFFlow,
  provideFLayout,
  withA11y,
  withControlScheme,
  withFlowState,
} from '@foblex/flow';
import { DagreLayoutEngine } from '@foblex/flow-dagre-layout';
import { CampaignEditorController } from '../../controllers';
import {
  CampaignAddContext,
  CampaignConnectionRecord,
  CampaignNodeRecord,
  ECampaignNodeType,
} from '../../domain';
import { CAMPAIGN_ADD_SLOT_SIZE, CampaignLayoutCoordinator } from '../../layout';
import { CampaignStorage } from '../../persistence';
import { CampaignState } from '../../state';
import { CampaignAddButton } from '../campaign-add-button/campaign-add-button';
import { CampaignInspector } from '../campaign-inspector/campaign-inspector';
import { CampaignNode } from '../campaign-node/campaign-node';
import { CampaignToolbar } from '../campaign-toolbar/campaign-toolbar';
import { ECampaignViewportAction } from '../campaign-toolbar/e-campaign-viewport-action';

@Component({
  selector: 'campaign-studio',
  standalone: true,
  imports: [CampaignAddButton, CampaignInspector, CampaignNode, CampaignToolbar, FFlowModule],
  providers: [
    provideFFlow(
      { id: 'campaign-studio' },
      withFlowState({
        stateClass: CampaignState,
      }),
      withA11y(),
      withControlScheme(F_DEFAULT_CONTROL_SCHEME),
    ),
    provideFLayout(DagreLayoutEngine, { mode: EFLayoutMode.MANUAL }),
    { provide: CampaignState, useExisting: FFlowState },
    CampaignLayoutCoordinator,
    CampaignStorage,
    CampaignEditorController,
  ],
  templateUrl: './campaign-studio.html',
  styleUrls: ['./campaign-studio.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignStudio implements OnInit, OnDestroy {
  protected readonly controller = inject(CampaignEditorController);
  protected readonly addSlotSize = CAMPAIGN_ADD_SLOT_SIZE;

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _zoom = viewChild(FZoomDirective);
  private readonly _addButtons = viewChildren(CampaignAddButton);
  private _initialFitComplete = false;
  private _pendingSelectionCenters = 0;
  private _selectionCenterBatchOpen = false;
  private _selectionCenterSubscription: { unsubscribe(): void } | null = null;

  protected readonly isHorizontal = computed(
    () => this.controller.direction() === EFLayoutDirection.LEFT_RIGHT,
  );
  protected readonly targetSide = computed(() =>
    this.isHorizontal() ? EFConnectableSide.LEFT : EFConnectableSide.TOP,
  );

  public ngOnInit(): void {
    void this.controller.initialize();
  }

  public ngOnDestroy(): void {
    this._finishSelectionCenterBatch();
  }

  protected flowRendered(): void {
    if (this._initialFitComplete) {
      return;
    }

    this._initialFitComplete = true;
    if (!this.controller.transform().position) {
      this._canvas()?.fitToScreen({ x: 72, y: 72 }, false, false);
    }
  }

  protected selectionChanged(event: FSelectionChangeEvent): void {
    if (event.nodeIds.length === 1) {
      this._centerNode(event.nodeIds[0]);
    }
  }

  protected openSelectedAddStepPicker(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const flow = this._flow();
    if (!flow || keyboardEvent.target !== flow.hostElement || keyboardEvent.repeat) {
      return;
    }

    queueMicrotask(() => {
      if (keyboardEvent.defaultPrevented) {
        return;
      }

      const selectedNodeIds = this.controller.state.selection().nodeIds;
      if (selectedNodeIds.length !== 1) {
        return;
      }

      this._addButtons()
        .find((addButton) => addButton.nodeId() === selectedNodeIds[0])
        ?.open();
    });
  }

  protected nodeAriaLabel(node: CampaignNodeRecord): string {
    return `${node.title}. ${node.description}. ${node.isActive ? 'Active' : 'Paused'}`;
  }

  protected connectionAddContext(connection: CampaignConnectionRecord): CampaignAddContext {
    return { kind: 'connection', connectionId: connection.id };
  }

  protected async addStep(context: CampaignAddContext, type: ECampaignNodeType): Promise<void> {
    const nodeId = await this.controller.insertStep(context, type);
    if (nodeId) {
      this._selectAndCenterNode(nodeId);
    }
  }

  protected async changeDirection(direction: EFLayoutDirection): Promise<void> {
    await this.controller.setDirection(direction);
    this._fitAfterLayout();
  }

  protected executeViewportAction(action: ECampaignViewportAction): void {
    switch (action) {
      case ECampaignViewportAction.ZOOM_IN:
        this._zoom()?.zoomIn();
        break;
      case ECampaignViewportAction.ZOOM_OUT:
        this._zoom()?.zoomOut();
        break;
      case ECampaignViewportAction.FIT:
        this._canvas()?.fitToScreen({ x: 72, y: 72 }, true, true);
        break;
    }
  }

  protected closeInspector(): void {
    this.controller.clearSelection();
    this._flow()?.clearSelection();
  }

  protected async deleteSelectedStep(): Promise<void> {
    await this.controller.deleteSelectedStep();
    this.controller.clearSelection();
    this._flow()?.clearSelection();
  }

  protected async resetCampaign(): Promise<void> {
    this.controller.clearSelection();
    this._flow()?.clearSelection();
    await this.controller.reset();
    this._fitAfterLayout();
  }

  private _fitAfterLayout(): void {
    setTimeout(() => this._canvas()?.fitToScreen({ x: 72, y: 72 }, true, true));
  }

  private _centerNode(nodeId: string): void {
    const canvas = this._canvas();
    if (!canvas) {
      return;
    }

    this._beginSelectionCenterBatch(canvas);
    this._pendingSelectionCenters++;
    canvas.resetScaleAndCenterGroupOrNode(nodeId);
  }

  private _selectAndCenterNode(nodeId: string): void {
    const flow = this._flow();
    if (!flow) {
      return;
    }

    this._centerNode(nodeId);
    this.controller.selectNode(nodeId);
    flow.select([nodeId], [], false);
  }

  private _beginSelectionCenterBatch(canvas: FCanvasComponent): void {
    if (this._selectionCenterBatchOpen) {
      return;
    }

    this._selectionCenterBatchOpen = true;
    this.controller.state.beginBatch();
    this._selectionCenterSubscription = canvas.fCanvasChange.subscribe((event) => {
      this._selectionCenterChanged(event);
    });
  }

  private _selectionCenterChanged(event: FCanvasChangeEvent): void {
    if (!this._selectionCenterBatchOpen || !this._pendingSelectionCenters) {
      return;
    }

    this.controller.state.applyTransform(event);
    this._pendingSelectionCenters--;
    if (!this._pendingSelectionCenters) {
      this._finishSelectionCenterBatch();
    }
  }

  private _finishSelectionCenterBatch(): void {
    this._selectionCenterSubscription?.unsubscribe();
    this._selectionCenterSubscription = null;
    this._pendingSelectionCenters = 0;
    if (this._selectionCenterBatchOpen) {
      this._selectionCenterBatchOpen = false;
      this.controller.state.endBatch();
    }
  }
}
