import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  EFConnectableSide,
  EFConnectionBehavior,
  EFConnectionType,
  EFMarkerType,
  FCanvasComponent,
  FFlowModule,
  FZoomDirective,
} from '@foblex/flow';
import { IPoint, PointExtensions } from '@foblex/2d';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'stress-test-with-connections',
  styleUrls: ['./stress-test-with-connections.component.scss'],
  templateUrl: './stress-test-with-connections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelect, FZoomDirective],
})
export class StressTestWithConnectionsComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly eMarkerType = EFMarkerType;
  protected readonly counts = [25, 50, 75, 100, 150];
  protected readonly behaviors: string[] = [
    EFConnectionBehavior.FIXED,
    EFConnectionBehavior.FIXED_CENTER,
    EFConnectionBehavior.FLOATING,
  ];
  protected readonly types: string[] = [
    EFConnectionType.STRAIGHT,
    EFConnectionType.SEGMENT,
    EFConnectionType.BEZIER,
    EFConnectionType.ADAPTIVE_CURVE,
  ];

  protected readonly count = signal(50);
  protected readonly behavior = signal(EFConnectionBehavior.FLOATING);
  protected readonly type = signal(EFConnectionType.STRAIGHT);

  protected readonly nodes = computed(() => {
    const count = this.count();

    return untracked(() => this._generateNodes(count));
  });

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(20, 20), false);
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
}
