import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule,
  FReflowController,
  provideFFlow,
  withReflowOnResize,
} from '@foblex/flow';
import { FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'reflow-pattern-live',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent],
  providers: [provideFFlow(withReflowOnResize())],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _reflow = inject(FReflowController);

  protected readonly enabled = signal(true);

  protected loaded(): void {
    this._canvas()?.fitToScreen({ x: 100, y: 100 }, true);
  }

  protected toggleEnabled(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    this._reflow.setConfig({ enabled: next });
  }
}
