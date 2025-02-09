import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import * as dagre from "dagre";
import { IPoint, PointExtensions } from '@foblex/2d';
import { graphlib } from 'dagre';
import Graph = graphlib.Graph;
import { FCheckboxComponent } from '@foblex/m-render';
import { generateGuid } from '@foblex/utils';
import { NgClass } from '@angular/common';

interface INodeViewModel {
  id: string;
  connectorId: string;
  position: IPoint;
}

interface IConnectionViewModel {
  id: string;
  from: string;
  to: string;
}

@Component({
  selector: 'dagre-layout-example',
  styleUrls: [ './dagre-layout-example.component.scss' ],
  templateUrl: './dagre-layout-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
    NgClass
  ]
})
export class DagreLayoutExampleComponent implements OnInit {

  protected nodes: INodeViewModel[] = [];
  protected connections: IConnectionViewModel[] = [];

  protected configuration = CONFIGURATION[ Direction.TOP_TO_BOTTOM ];

  @ViewChild(FFlowComponent, { static: true })
  protected fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvasComponent!: FCanvasComponent;

  protected isAutoLayout: boolean = true;

  public ngOnInit(): void {
    this._getData(new dagre.graphlib.Graph(), Direction.TOP_TO_BOTTOM);
  }

  protected onLoaded(): void {
    this.fitToScreen();
  }

  private _getData(graph: Graph, direction: Direction): void {
    if (this.isAutoLayout) {
      this.fFlowComponent.reset();
      // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
    }
    this._setGraph(graph, direction);
    this.nodes = this._getNodes(graph);
    this.connections = this.getConnections(graph);
  }

  private _setGraph(graph: Graph, direction: Direction): void {
    this.configuration = CONFIGURATION[ direction ];
    graph.setGraph({ rankdir: direction });
    GRAPH_DATA.forEach(node => {
      graph.setNode(node.id, { width: 120, height: 73 });
      if (node.parentId != null) {
        graph.setEdge(node.parentId, node.id, {});
      }
    });
    dagre.layout(graph);
  }

  private _getNodes(graph: Graph): INodeViewModel[] {
    return graph.nodes().map((x) => {
      let node = graph.node(x);
      return {
        id: generateGuid(),
        connectorId: x,
        position: { x: node.x, y: node.y }
      }
    });
  }

  private getConnections(graph: Graph): IConnectionViewModel[] {
    return graph.edges().map((x) => ({ id: generateGuid(), from: x.v, to: x.w }));
  }

  protected horizontal(): void {
    this._getData(new dagre.graphlib.Graph(), Direction.LEFT_TO_RIGHT);
  }

  protected vertical(): void {
    this._getData(new dagre.graphlib.Graph(), Direction.TOP_TO_BOTTOM);
  }

  protected fitToScreen(): void {
    this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 50), false);
  }

  protected onAutoLayoutChange(checked: boolean): void {
    this.isAutoLayout = checked;
  }
}

enum Direction {
  LEFT_TO_RIGHT = 'LR',
  TOP_TO_BOTTOM = 'TB'
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

const GRAPH_DATA = [
  { id: 'Node1', parentId: null },
  { id: 'Node2', parentId: 'Node1' },
  { id: 'Node3', parentId: 'Node1' },
  { id: 'Node4', parentId: 'Node3' },
  { id: 'Node5', parentId: 'Node3' },
  { id: 'Node6', parentId: 'Node3' },
  { id: 'Node7', parentId: 'Node3' },
  { id: 'Node8', parentId: 'Node2' }
];
