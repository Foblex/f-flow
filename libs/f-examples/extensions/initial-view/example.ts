import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FZoomDirective, PointExtensions } from '@foblex/flow';
import { FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'initial-view',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FZoomDirective, FToolbarComponent],
})
export class Example {
  private readonly _canvas = viewChild(FCanvasComponent);

  protected readonly visible = signal(true);

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(100, 100), false);
  }

  protected replay(): void {
    this.visible.set(false);
    setTimeout(() => this.visible.set(true));
  }
}
