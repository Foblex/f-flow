import { ChangeDetectionStrategy, Component, OnInit, signal, ViewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';
import { FCheckboxComponent } from '@foblex/m-render';
import { generateGuid } from '@foblex/utils';
import { NgClass } from '@angular/common';

@Component({
  selector: 'elkjs-layout-example',
  styleUrls: [ './elkjs-layout-example.component.scss' ],
  templateUrl: './elkjs-layout-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
    NgClass
  ]
})
export class ElkjsLayoutExampleComponent implements OnInit {

  private ELK!: any;

  protected nodes = signal<any[]>([]);
  protected connections = signal<any[]>([]);

  protected configuration = CONFIGURATION[ Direction.TOP_TO_BOTTOM ];

  @ViewChild(FFlowComponent, { static: false })
  protected fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: false })
  protected fCanvasComponent!: FCanvasComponent;

  protected isAutoLayout: boolean = true;

  public ngOnInit(): void {
    this.getData(Direction.TOP_TO_BOTTOM);
  }

  protected onLoaded(): void {
    this.fitToScreen();
  }

  private getData(direction: Direction): void {
    this.configuration = CONFIGURATION[ direction ];
    this.mapGraphData({
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        "spacing.nodeNodeBetweenLayers": 40
      },
      ...GRAPH_DATA
    });
  }

  private async mapGraphData(configuration: any): Promise<void> {
    return this.loadElk().then(ELK => {
      return new ELK().layout(configuration);
    }).then((data: any) => {
      if (this.isAutoLayout) {
        this.fFlowComponent?.reset();
        // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
      }
      this.connections.set(this.getConnections(data));
      this.nodes.set(this.getNodes(data));
    }).catch(console.error);
  }

  private loadElk(): Promise<any> {
    if (this.ELK) {
      return Promise.resolve(this.ELK);
    }

    return import('elkjs/lib/elk.bundled').then(module => {
      this.ELK = module.default;
      return this.ELK;
    });
  }

  private getNodes(data: any): any[] {
    return data.children!.map((node: any) => {
      return {
        id: generateGuid(),
        connectorId: node.id,
        position: PointExtensions.initialize(node.x, node.y)
      };
    });
  }

  private getConnections(data: any): any[] {
    return data.edges!.map((edge: any) => {
      return {
        id: generateGuid(),
        from: edge.sources[ 0 ],
        to: edge.targets[ 0 ]
      };
    });
  }

  protected horizontal(): void {
    this.getData(Direction.LEFT_TO_RIGHT);
  }

  protected vertical(): void {
    this.getData(Direction.TOP_TO_BOTTOM);
  }

  protected fitToScreen(): void {
    this.fCanvasComponent?.fitToScreen(PointExtensions.initialize(50, 50), false);
  }

  protected onAutoLayoutChange(checked: boolean): void {
    this.isAutoLayout = checked;
  }
}

enum Direction {
  LEFT_TO_RIGHT = 'RIGHT',
  TOP_TO_BOTTOM = 'DOWN'
}

const CONFIGURATION = {
  [ Direction.LEFT_TO_RIGHT ]: {
    outputSide: EFConnectableSide.RIGHT,
    inputSide: EFConnectableSide.LEFT
  },
  [ Direction.TOP_TO_BOTTOM ]: {
    outputSide: EFConnectableSide.BOTTOM,
    inputSide: EFConnectableSide.TOP
  }
};

const GRAPH_DATA = {
  children: [
    { id: 'Node1', width: 120, height: 73 },
    { id: 'Node2', width: 120, height: 73 },
    { id: 'Node3', width: 120, height: 73 },
    { id: 'Node4', width: 120, height: 73 },
    { id: 'Node5', width: 120, height: 73 },
    { id: 'Node6', width: 120, height: 73 },
    { id: 'Node7', width: 120, height: 73 },
    { id: 'Node8', width: 120, height: 73 }
  ],
  edges: [
    { id: 'Edge1', sources: [ 'Node1' ], targets: [ 'Node2' ] },
    { id: 'Edge2', sources: [ 'Node1' ], targets: [ 'Node3' ] },
    { id: 'Edge3', sources: [ 'Node3' ], targets: [ 'Node4' ] },
    { id: 'Edge4', sources: [ 'Node3' ], targets: [ 'Node5' ] },
    { id: 'Edge5', sources: [ 'Node3' ], targets: [ 'Node6' ] },
    { id: 'Edge6', sources: [ 'Node3' ], targets: [ 'Node7' ] },
    { id: 'Edge7', sources: [ 'Node2' ], targets: [ 'Node8' ] }
  ]
};
