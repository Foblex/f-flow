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
  EFReflowMode,
  FCanvasComponent,
  FFlowModule,
  FReflowController,
  provideFFlow,
  withReflowOnResize,
} from '@foblex/flow';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'reflow-mode',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent],
  providers: [provideFFlow(withReflowOnResize({ mode: EFReflowMode.CENTER_OF_MASS }))],
})
export class Example implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _reflow = inject(FReflowController);
  private readonly _injector = inject(Injector);

  protected readonly modes: KeyValue<EFReflowMode, string>[] = [
    { key: EFReflowMode.CENTER_OF_MASS, value: 'Center of mass' },
    { key: EFReflowMode.X_RANGE, value: 'X range' },
    { key: EFReflowMode.DOWNSTREAM_CONNECTIONS, value: 'Downstream connections' },
  ];
  protected readonly mode = model<EFReflowMode>(EFReflowMode.CENTER_OF_MASS);

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        const next = this.mode();
        untracked(() => this._reflow.setConfig({ mode: next }));
      },
      { injector: this._injector },
    );
  }

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }
}
