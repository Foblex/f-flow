import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, provideFFlow, withReflowOnResize } from '@foblex/flow';

@Component({
  selector: 'reflow-basics',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withReflowOnResize())],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly expanded = signal(false);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }

  protected toggleNode(): void {
    this.expanded.update((x) => !x);
  }
}
