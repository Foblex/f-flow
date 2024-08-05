import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnInit,
  ViewChild,
} from '@angular/core';
import {
  FCreateNodeEvent, EFMarkerType,
  FCanvasComponent, FFlowModule, FZoomDirective,
  FReassignConnectionEvent, FCreateConnectionEvent
} from '@foblex/flow';
import { IPoint, Point } from '@foblex/core';
import { IFlowNodeViewModel } from '../../domain/node/i-flow-node-view-model';
import { IFlowConnectionViewModel } from '../../domain/connection/i-flow-connection-view-model';
import { ENodeType } from '../../domain/e-node-type';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PaletteComponent } from '../palette/palette.component';
import { NodeComponent } from '../node/node.component';
import { MapToNodeViewModelHandler } from '../../domain/node/map/map-to-node-view-model.handler';
import {
  MapToConnectionViewModelHandler
} from '../../domain/connection/map/map-to-connection-view-model.handler';
import { FlowService } from '../../domain/flow.service';
import { IFlowViewModel } from '../../domain/i-flow-view-model';

@Component({
  selector: 'visual-programming-flow',
  templateUrl: './flow.component.html',
  styleUrls: [ './flow.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FlowService
  ],
  imports: [
    FFlowModule,
    ToolbarComponent,
    PaletteComponent,
    NodeComponent
  ]
})
export class FlowComponent implements OnInit {

  protected viewModel: IFlowViewModel = {
    nodes: [],
    connections: []
  };

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: true })
  public fZoomDirective!: FZoomDirective;

  protected readonly eMarkerType = EFMarkerType;

  constructor(
    private apiService: FlowService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.getData();
  }

  public onInitialized(): void {
    this.fCanvasComponent.fitToScreen(new Point(40, 40), false);
  }

  private getData(): void {
    this.viewModel = this.apiService.getFlow();
    this.changeDetectorRef.markForCheck();
  }

  public onNodeAdded(event: FCreateNodeEvent): void {
    this.apiService.addNode(event.data as ENodeType, event.rect);
    this.getData();
  }

  public onReassignConnection(event: FReassignConnectionEvent): void {
    this.apiService.reassignConnection(event.fOutputId, event.oldFInputId, event.newFInputId);
    this.getData();
  }

  public onConnectionAdded(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.apiService.addConnection(event.fOutputId, event.fInputId);
    this.getData();
  }

  public onNodePositionChanged(point: IPoint, node: any): void {
    node.position = point;
    this.apiService.moveNode(node.id, point);
  }
}
