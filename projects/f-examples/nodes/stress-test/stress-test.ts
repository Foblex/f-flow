import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FCanvasComponent, FFlowComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FCheckboxComponent } from '@foblex/m-render';

type Edge = { source: number; target: number };

type Cell = {
  node: number;
  cIndex: number;
  rIndex: number;
};

@Component({
  selector: 'stress-test',
  styleUrls: ['./stress-test.scss'],
  templateUrl: './stress-test.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FZoomDirective,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FCheckboxComponent,
  ],
})
export class StressTest {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _flow = viewChild(FFlowComponent);

  protected readonly totals = [200, 500, 1000, 2000, 5000];

  protected readonly showConnections = signal(false);
  protected readonly virtualization = signal(false);
  protected readonly cache = signal(false);

  protected readonly totalNodes = signal(200);

  protected readonly cells = computed<readonly Cell[]>(() => {
    const total = this.totalNodes();

    const cols = Math.ceil(Math.sqrt(total));
    const nodesPerCol = Math.ceil(total / cols);

    untracked(() => this._flow()?.reset());

    const result: Cell[] = new Array(total);

    for (let i = 0; i < total; i++) {
      const node = i + 1;
      const cIndex = Math.floor(i / nodesPerCol);
      const rIndex = i - cIndex * nodesPerCol;

      result[i] = { node, cIndex, rIndex };
    }

    return result;
  });

  protected readonly trackCell = (_: number, c: Cell) => c.cIndex + '-' + c.rIndex;

  protected readonly connections = computed<Edge[]>(() => {
    const total = this.totalNodes();
    const edges: Edge[] = [];
    for (let i = 1; i < total; i++) {
      edges.push({ source: i, target: i + 1 });
    }

    return edges;
  });

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(20, 20), false);
  }

  protected toggleConnections(): void {
    this.showConnections.update((x) => !x);
  }

  protected toggleVirtualization(): void {
    this._flow()?.reset();
    this.virtualization.update((x) => !x);
  }

  protected toggleCache(): void {
    this.cache.update((x) => !x);
  }
}
