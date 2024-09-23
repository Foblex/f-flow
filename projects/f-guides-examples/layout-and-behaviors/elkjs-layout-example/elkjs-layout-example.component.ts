import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';
import { FCheckboxComponent } from '@foblex/f-docs';
import { generateGuid } from '@foblex/utils';

@Component({
  selector: 'elkjs-layout-example',
  styleUrls: [ './elkjs-layout-example.component.scss' ],
  templateUrl: './elkjs-layout-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent
  ]
})
export class ElkjsLayoutExampleComponent implements OnInit {

  private ELK!: any;

  public nodes: any[] = [];
  public connections: any[] = [];

  public configuration = CONFIGURATION[ Direction.TOP_TO_BOTTOM ];

  @ViewChild(FFlowComponent, { static: true })
  public fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  public isAutoLayout: boolean = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.getData(Direction.TOP_TO_BOTTOM);
  }

  public onLoaded(): void {
    this.fitToScreen();
  }

  private getData(direction: Direction): void {
    this.configuration = CONFIGURATION[ direction ];
    if (this.isAutoLayout) {
      this.fFlowComponent.reset();
      // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
    }
    this.mapGraphData({
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
      },
      ...GRAPH_DATA
    });
  }

  private async mapGraphData(configuration: any): Promise<void> {
    return this.loadElk().then(ELK => {
      return new ELK().layout(configuration);
    }).then((data: any) => {
      this.connections = this.getConnections(data);
      this.nodes = this.getNodes(data);
      this.changeDetectorRef.markForCheck();
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

  public horizontal(): void {
    this.getData(Direction.LEFT_TO_RIGHT);
  }

  public vertical(): void {
    this.getData(Direction.TOP_TO_BOTTOM);
  }

  public fitToScreen(): void {
    this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 50), false);
  }

  public onAutoLayoutChange(checked: boolean): void {
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
    { id: 'Node1', width: 100, height: 33 },
    { id: 'Node2', width: 100, height: 33 },
    { id: 'Node3', width: 100, height: 33 },
    { id: 'Node4', width: 100, height: 33 },
    { id: 'Node5', width: 100, height: 33 },
    { id: 'Node6', width: 100, height: 33 },
    { id: 'Node7', width: 100, height: 33 },
    { id: 'Node8', width: 100, height: 33 }
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
