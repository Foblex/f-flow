import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  EFConnectableSide,
  EFConnectionBehavior,
  EFConnectionType,
  EFMarkerType,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FZoomDirective,
} from '@foblex/flow';
import { IPoint, PointExtensions } from '@foblex/2d';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'stress-test-with-connections',
  styleUrls: ['./stress-test-with-connections.component.scss'],
  templateUrl: './stress-test-with-connections.component.html',
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelect, FZoomDirective],
})
export class StressTestWithConnectionsComponent implements OnInit, AfterViewInit {
  @ViewChild(FFlowComponent, { static: false })
  public fFlow!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: false })
  public fCanvas!: FCanvasComponent;

  public counts: number[] = [25, 50, 75, 100, 150];
  public count = 25;

  public behaviors: string[] = [
    EFConnectionBehavior.FIXED,
    EFConnectionBehavior.FIXED_CENTER,
    EFConnectionBehavior.FLOATING,
  ];
  public behavior = EFConnectionBehavior.FLOATING;

  public types: string[] = [
    EFConnectionType.STRAIGHT,
    EFConnectionType.SEGMENT,
    EFConnectionType.BEZIER,
  ];
  public type = EFConnectionType.STRAIGHT;

  public nodes: { id: number; position: IPoint; side: EFConnectableSide }[] = [];

  public onLoaded(): void {
    this.fCanvas?.fitToScreen(PointExtensions.initialize(20, 20), false);
  }

  public ngOnInit(): void {
    this.nodes = this._generateNodes(this.count);
  }

  public ngAfterViewInit(): void {
    this.fFlow.reset();
  }

  private _generateNodes(
    nodeCount: number,
    spacing: number = 10,
  ): { id: number; position: IPoint; side: EFConnectableSide }[] {
    const result: { id: number; position: IPoint; side: EFConnectableSide }[] = [];

    const nodeSize = 100;
    const baseRadius = 150;

    const sides: EFConnectableSide[] = [
      EFConnectableSide.BOTTOM,
      EFConnectableSide.LEFT,
      EFConnectableSide.TOP,
      EFConnectableSide.RIGHT,
    ];
    const nodesPerSide = Math.ceil(nodeCount / 4);

    for (let i = 0; i < nodeCount; i++) {
      const side = sides[i % 4];

      let x = 0;
      let y = 0;
      const radius = baseRadius + Math.floor(i / 4) * (nodeSize + spacing);

      switch (side) {
        case EFConnectableSide.BOTTOM:
          x =
            (i % nodesPerSide) * (nodeSize + spacing) -
            ((nodesPerSide - 1) * (nodeSize + spacing)) / 2;
          y = -radius;
          break;
        case EFConnectableSide.LEFT:
          x = radius;
          y =
            (i % nodesPerSide) * (nodeSize + spacing) -
            ((nodesPerSide - 1) * (nodeSize + spacing)) / 2;
          break;
        case EFConnectableSide.TOP:
          x =
            (i % nodesPerSide) * (nodeSize + spacing) -
            ((nodesPerSide - 1) * (nodeSize + spacing)) / 2;
          y = radius;
          break;
        case EFConnectableSide.RIGHT:
          x = -radius;
          y =
            (i % nodesPerSide) * (nodeSize + spacing) -
            ((nodesPerSide - 1) * (nodeSize + spacing)) / 2;
          break;
      }

      result.push({ id: i + 1, position: { x, y }, side });
    }

    return result;
  }

  protected readonly eMarkerType = EFMarkerType;

  public onSelectionChange(event: MatSelectChange): void {
    this.nodes = this._generateNodes(event.value);
  }
}
