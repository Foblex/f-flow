import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  EFReflowAxis,
  EFReflowCollision,
  EFReflowDeltaSource,
  EFReflowMode,
  EFReflowScope,
  F_DEFAULT_CONTROL_SCHEME,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FFlowState,
  FZoomDirective,
  provideFFlow,
  withA11y,
  withControlScheme,
  withFlowState,
  withReflowOnResize,
} from '@foblex/flow';
import { CallCenterNode } from '../call-center-node/call-center-node';
import { CallCenterFlowToolbar } from '../call-center-flow-toolbar/call-center-flow-toolbar';
import { CallCenterNodePalette } from '../call-center-node-palette/call-center-node-palette';
import { ECallCenterFlowAction } from '../call-center-flow-toolbar/e-call-center-flow-action';
import { CallCenterNodeRecord, CALL_CENTER_NODE_METADATA } from '../../domain';
import { CallCenterFlowState } from '../../state';
import { CallCenterFlowStorage } from '../../persistence/call-center-flow-storage';

@Component({
  selector: 'call-center-flow',
  templateUrl: './call-center-flow.html',
  styleUrls: ['./call-center-flow.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, CallCenterNode, CallCenterFlowToolbar, CallCenterNodePalette],
  providers: [
    provideFFlow(
      { id: 'main' },
      withFlowState({ stateClass: CallCenterFlowState, canvasTransformDebounce: 200 }),
      withA11y({ moveStep: 20 }),
      withControlScheme(F_DEFAULT_CONTROL_SCHEME),
      withReflowOnResize({
        mode: EFReflowMode.DOWNSTREAM_CONNECTIONS,
        collision: EFReflowCollision.CHAIN_PUSH,
        scope: EFReflowScope.CONNECTED_SUBGRAPH,
        axis: EFReflowAxis.VERTICAL,
        deltaSource: EFReflowDeltaSource.EDGE_BASED,
        spacing: { vertical: 24 },
        maxCascadeDepth: 8,
        maxAbsoluteShiftPerPlan: 10000,
      }),
    ),
    { provide: CallCenterFlowState, useExisting: FFlowState },
    CallCenterFlowStorage,
  ],
})
export class CallCenterFlow implements OnInit {
  public readonly flowId = input.required<string>();

  protected readonly state = inject(CallCenterFlowState);

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _zoom = viewChild(FZoomDirective);

  protected readonly nodes = this.state.nodes;
  protected readonly connections = this.state.connections;
  protected readonly transform = this.state.transform;

  public ngOnInit(): void {
    this.state.initialize(this.flowId());
  }

  protected resetFlow(): void {
    this._flow()?.reset();
    this.state.reset();
  }

  protected editorLoaded(): void {
    if (this.transform().position) {
      return;
    }

    this._canvas()?.fitToScreen({ x: 150, y: 150 }, false, false);
  }

  protected nodeAriaLabel(node: CallCenterNodeRecord): string {
    const name = CALL_CENTER_NODE_METADATA[node.type].name;

    return node.description ? `${name}: ${node.description}` : name;
  }

  protected executeAction(event: ECallCenterFlowAction): void {
    switch (event) {
      case ECallCenterFlowAction.SELECT_ALL:
        this._flow()?.selectAll();
        break;
      case ECallCenterFlowAction.ZOOM_IN:
        this._zoom()?.zoomIn();
        break;
      case ECallCenterFlowAction.ZOOM_OUT:
        this._zoom()?.zoomOut();
        break;
      case ECallCenterFlowAction.FIT_TO_SCREEN:
        this._canvas()?.fitToScreen();
        break;
      case ECallCenterFlowAction.ONE_TO_ONE:
        this._canvas()?.resetScaleAndCenter();
        break;
    }
  }
}
