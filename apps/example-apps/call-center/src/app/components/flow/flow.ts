import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  EFMarkerType,
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FFlowComponent,
  FFlowModule,
  FMoveNodesEvent,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
  FZoomDirective,
} from '@foblex/flow';
import { FormsModule } from '@angular/forms';
import { FlowNode } from '../flow-node/flow-node';
import { FlowActionPanel } from '../flow-action-panel/flow-action-panel';
import { FlowPalette } from '../flow-palette/flow-palette';
import { FlowActionPanelAction } from '../flow-action-panel/flow-action-panel-action';
import { A, BACKSPACE, DASH, DELETE, NUMPAD_MINUS, NUMPAD_PLUS } from '@angular/cdk/keycodes';
import { EOperationSystem, PlatformService } from '@foblex/platform';
import { FlowStore } from '../../store/flow-store';

@Component({
  selector: 'flow',
  templateUrl: './flow.html',
  styleUrls: ['./flow.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, FlowNode, FlowActionPanel, FlowPalette, FormsModule],
  providers: [FlowStore],
  host: {
    '(keydown)': 'onKeyDown($event)',
    'tabindex': '-1',
  },
})
export class Flow implements OnInit {
  public readonly id = input.required<string>();

  protected readonly store = inject(FlowStore);
  private readonly _platform = inject(PlatformService);

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _zoom = viewChild(FZoomDirective);

  private _isChangeAfterLoadedResetAndCenter = true;

  protected readonly fCanvasChangeEventDebounce = 200;

  protected readonly viewModel = computed(() => this.store.model());

  protected readonly nodes = this.store.nodes;
  protected readonly connections = this.store.connections;

  protected eMarkerType = EFMarkerType;

  public ngOnInit(): void {
    this.store.initialize(this.id());
    this._applySelection();
  }

  private _applySelection(): void {
    const model = this.store.model();
    if (model?.selection) {
      this._flow()?.select(model.selection.nodes || [], model.selection.connections || [], false);
    }
  }

  protected reset(): void {
    this._flow()?.reset();
    this.store.resetFlow();
    this._isChangeAfterLoadedResetAndCenter = true;
    this.store.initialize(this.id());
  }

  protected editorLoaded(): void {
    this._isChangeAfterLoadedResetAndCenter = true;
    this._canvas()?.fitToScreen({ x: 150, y: 150 }, false);
  }

  protected changeCanvasTransform(event: FCanvasChangeEvent): void {
    if (this._isChangeAfterLoadedResetAndCenter) {
      this._isChangeAfterLoadedResetAndCenter = false;

      return;
    }
    this.store.transformCanvas(event);
  }

  protected createNode(event: FCreateNodeEvent): void {
    this.store.createNode(event);
  }

  protected moveNodes(event: FMoveNodesEvent): void {
    this.store.moveNodes(event);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    this.store.createConnection(event);
  }

  protected reassignConnection(event: FReassignConnectionEvent): void {
    this.store.reassignConnection(event);
  }

  protected changeSelection(event: FSelectionChangeEvent): void {
    this.store.changeSelection(event);
    this._applySelection();
  }

  protected removeConnection(outputId: string): void {
    this.store.removeConnectionByOutput(outputId);
  }

  private _selectAll(): void {
    this._flow()?.selectAll();
    this.store.selectAll();
  }

  protected processAction(event: FlowActionPanelAction): void {
    switch (event) {
      case FlowActionPanelAction.SELECT_ALL:
        this._selectAll();
        break;
      case FlowActionPanelAction.ZOOM_IN:
        this._zoom()?.zoomIn();
        break;
      case FlowActionPanelAction.ZOOM_OUT:
        this._zoom()?.zoomOut();
        break;
      case FlowActionPanelAction.FIT_TO_SCREEN:
        this._canvas()?.fitToScreen();
        break;
      case FlowActionPanelAction.ONE_TO_ONE:
        this._canvas()?.resetScaleAndCenter();
        break;
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (event.keyCode) {
      case BACKSPACE:
      case DELETE:
        this.store.removeSelected();
        break;
      case NUMPAD_PLUS:
        if (this._isCommandButton(event)) {
          this._zoom()?.zoomIn();
        }
        break;
      case NUMPAD_MINUS:
      case DASH:
        if (this._isCommandButton(event)) {
          this._zoom()?.zoomOut();
        }
        break;
      case A:
        if (this._isCommandButton(event)) {
          this._selectAll();
        }
        break;
    }
  }

  private _isCommandButton(event: { metaKey: boolean; ctrlKey: boolean }): boolean {
    return this._platform.getOS() === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  }
}
