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
  EFReflowScope,
  FCanvasComponent,
  FFlowModule,
  FReflowController,
  provideFFlow,
  withReflowOnResize,
} from '@foblex/flow';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'reflow-scope',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent],
  providers: [provideFFlow(withReflowOnResize({ scope: EFReflowScope.GLOBAL }))],
})
export class Example implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _reflow = inject(FReflowController);
  private readonly _injector = inject(Injector);

  protected readonly scopes: KeyValue<EFReflowScope, string>[] = [
    { key: EFReflowScope.GLOBAL, value: 'Global' },
    { key: EFReflowScope.GROUP, value: 'Group siblings only' },
    { key: EFReflowScope.CONNECTED_SUBGRAPH, value: 'Connected subgraph' },
  ];
  protected readonly scope = model<EFReflowScope>(EFReflowScope.GLOBAL);

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        const next = this.scope();
        untracked(() => this._reflow.setConfig({ scope: next }));
      },
      { injector: this._injector },
    );
  }

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }
}
