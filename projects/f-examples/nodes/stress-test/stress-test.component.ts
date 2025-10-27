import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FCanvasComponent, FFlowComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { NgForOf } from '@angular/common';
import { PointExtensions } from '@foblex/2d';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FCheckboxComponent } from '@foblex/m-render';

type Edge = { source: number; target: number };

@Component({
  selector: 'stress-test',
  styleUrls: ['./stress-test.component.scss'],
  templateUrl: './stress-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    NgForOf,
    FZoomDirective,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FCheckboxComponent,
  ],
})
export class StressTestComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _flow = viewChild(FFlowComponent);

  protected readonly totals = [200, 500, 1000, 2000];

  protected readonly showConnections = signal(false);
  protected readonly totalNodes = signal(200);
  protected readonly columns = computed(() => {
    const total = this.totalNodes();
    const cols = Math.ceil(Math.sqrt(total));
    const nodesPerCol = Math.ceil(total / cols);

    untracked(() => this._flow()?.reset());
    const numbers = Array.from({ length: total }, (_, i) => i + 1);

    return Array.from({ length: cols }, (_, i) =>
      numbers.slice(i * nodesPerCol, (i + 1) * nodesPerCol),
    );
  });

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
}
