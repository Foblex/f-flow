import { ChangeDetectionStrategy, Component, OnInit, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { NgForOf } from '@angular/common';
import { PointExtensions } from '@foblex/2d';

@Component({
  selector: 'stress-test',
  styleUrls: ['./stress-test.component.scss'],
  templateUrl: './stress-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, NgForOf, FZoomDirective],
})
export class StressTestComponent implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected columns: number[][] | undefined;

  public ngOnInit(): void {
    const totalNodes = 500;
    const nodesPerColumn = Math.ceil(totalNodes / 25);

    const numbers = Array.from({ length: totalNodes }, (_, i) => i + 1);
    this.columns = Array.from({ length: 25 }, (_, i) =>
      numbers.slice(i * nodesPerColumn, (i + 1) * nodesPerColumn),
    );
  }

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(20, 20), false);
  }
}
