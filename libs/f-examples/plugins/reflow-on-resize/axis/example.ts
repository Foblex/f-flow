import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  model,
  OnInit,
  untracked,
  viewChild,
} from '@angular/core';
import { KeyValue } from '@angular/common';
import {
  EFReflowAxis,
  FCanvasComponent,
  FFlowModule,
  FReflowController,
  provideFFlow,
  withReflowOnResize,
} from '@foblex/flow';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'reflow-axis',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent],
  providers: [provideFFlow(withReflowOnResize({ axis: EFReflowAxis.BOTH }))],
})
export class Example implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _reflow = inject(FReflowController);
  private readonly _injector = inject(Injector);

  protected readonly axes: KeyValue<EFReflowAxis, string>[] = [
    { key: EFReflowAxis.BOTH, value: 'Both' },
    { key: EFReflowAxis.VERTICAL, value: 'Vertical only' },
    { key: EFReflowAxis.HORIZONTAL, value: 'Horizontal only' },
  ];
  protected readonly axis = model<EFReflowAxis>(EFReflowAxis.BOTH);

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        const next = this.axis();
        untracked(() => this._reflow.setConfig({ axis: next }));
      },
      { injector: this._injector },
    );
  }

  protected loaded(): void {
    this._canvas()?.fitToScreen({ x: 100, y: 100 }, true);
  }
}
