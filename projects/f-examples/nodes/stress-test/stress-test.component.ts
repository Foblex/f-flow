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

@Component({
  selector: 'stress-test',
  styleUrls: ['./stress-test.component.scss'],
  templateUrl: './stress-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, NgForOf, FZoomDirective, MatFormField, MatLabel, MatOption, MatSelect],
})
export class StressTestComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _flow = viewChild(FFlowComponent);

  protected readonly totals = [500, 1000, 2000, 5000];

  protected readonly totalNodes = signal(1000);
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

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(20, 20), false);
  }
}
