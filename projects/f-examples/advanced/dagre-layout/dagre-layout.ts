import {
  ChangeDetectionStrategy,
  Component,
  model,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import * as dagre from 'dagre';
import { IPoint, PointExtensions } from '@foblex/2d';
import { graphlib } from 'dagre';
import Graph = graphlib.Graph;
import { FCheckboxComponent } from '@foblex/m-render';
import { generateGuid } from '@foblex/utils';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'dagre-layout',
  styleUrls: ['./dagre-layout.scss'],
  templateUrl: './dagre-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent, NgClass, FormsModule],
})
export class DagreLayout implements OnInit {
  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected nodes = signal<INodeViewModel[]>([]);
  protected connections = signal<IConnectionViewModel[]>([]);

  protected configuration = signal(CONFIGURATION[Direction.TOP_TO_BOTTOM]);

  protected isAutoLayout = model(true);

  public ngOnInit(): void {
    this._getData(new dagre.graphlib.Graph(), Direction.TOP_TO_BOTTOM);
  }

  protected onLoaded(): void {
    this.fitToScreen();
  }

  private _getData(graph: Graph, direction: Direction): void {
    if (this.isAutoLayout()) {
      this._flow()?.reset();
      // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
    }
    this._updateGraph(graph, direction);
    this.nodes.set(this._calculateNodes(graph));
    this.connections.set(this._calculateConnections(graph));
  }

  private _updateGraph(graph: Graph, direction: Direction): void {
    this.configuration.set(CONFIGURATION[direction]);
    graph.setGraph({ rankdir: direction });
    GRAPH_DATA.forEach((node) => {
      graph.setNode(node.id, { width: 120, height: 73 });
      if (node.parentId != null) {
        graph.setEdge(node.parentId, node.id, {});
      }
    });
    dagre.layout(graph);
  }

  private _calculateNodes(graph: Graph): INodeViewModel[] {
    return graph.nodes().map((x) => {
      const node = graph.node(x);

      return {
        id: generateGuid(),
        connectorId: x,
        position: { x: node.x, y: node.y },
      };
    });
  }

  private _calculateConnections(graph: Graph): IConnectionViewModel[] {
    return graph.edges().map((x) => ({ id: generateGuid(), from: x.v, to: x.w }));
  }

  protected horizontal(): void {
    this._getData(new dagre.graphlib.Graph(), Direction.LEFT_TO_RIGHT);
  }

  protected vertical(): void {
    this._getData(new dagre.graphlib.Graph(), Direction.TOP_TO_BOTTOM);
  }

  protected fitToScreen(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(50, 50), false);
  }

  protected autoLayoutChanged(): void {
    this.isAutoLayout.update((x) => !x);
  }
}

enum Direction {
  LEFT_TO_RIGHT = 'LR',
  TOP_TO_BOTTOM = 'TB',
}

const CONFIGURATION = {
  [Direction.LEFT_TO_RIGHT]: {
    outputSide: EFConnectableSide.RIGHT,
    inputSide: EFConnectableSide.LEFT,
  },
  [Direction.TOP_TO_BOTTOM]: {
    outputSide: EFConnectableSide.BOTTOM,
    inputSide: EFConnectableSide.TOP,
  },
};

const GRAPH_DATA = [
  { id: 'Node1', parentId: null },
  { id: 'Node2', parentId: 'Node1' },
  { id: 'Node3', parentId: 'Node1' },
  { id: 'Node4', parentId: 'Node3' },
  { id: 'Node5', parentId: 'Node3' },
  { id: 'Node6', parentId: 'Node3' },
  { id: 'Node7', parentId: 'Node3' },
  { id: 'Node8', parentId: 'Node2' },
  { id: 'Node9', parentId: 'Node7' },
  { id: 'Node10', parentId: 'Node7' },
];
