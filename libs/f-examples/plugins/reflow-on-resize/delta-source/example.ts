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
  EFReflowDeltaSource,
  FCanvasComponent,
  FFlowModule,
  FReflowController,
  provideFFlow,
  withReflowOnResize,
} from '@foblex/flow';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'reflow-delta-source',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent],
  providers: [provideFFlow(withReflowOnResize({ deltaSource: EFReflowDeltaSource.EDGE_BASED }))],
})
export class Example implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _reflow = inject(FReflowController);
  private readonly _injector = inject(Injector);

  protected readonly deltaSources: KeyValue<EFReflowDeltaSource, string>[] = [
    { key: EFReflowDeltaSource.EDGE_BASED, value: 'Edge-based (recommended)' },
    { key: EFReflowDeltaSource.CENTER_BASED, value: 'Center-based' },
  ];
  protected readonly deltaSource = model<EFReflowDeltaSource>(EFReflowDeltaSource.EDGE_BASED);

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        const next = this.deltaSource();
        untracked(() => this._reflow.setConfig({ deltaSource: next }));
      },
      { injector: this._injector },
    );
  }

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }
}
