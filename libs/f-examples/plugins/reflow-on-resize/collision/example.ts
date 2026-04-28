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
  EFReflowCollision,
  FCanvasComponent,
  FFlowModule,
  FReflowController,
  provideFFlow,
  withReflowOnResize,
} from '@foblex/flow';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'reflow-collision',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent],
  providers: [provideFFlow(withReflowOnResize({ collision: EFReflowCollision.STOP }))],
})
export class Example implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _reflow = inject(FReflowController);
  private readonly _injector = inject(Injector);

  protected readonly collisions: KeyValue<EFReflowCollision, string>[] = [
    { key: EFReflowCollision.STOP, value: 'Stop at obstacle' },
    { key: EFReflowCollision.CHAIN_PUSH, value: 'Chain push (cascade)' },
  ];
  protected readonly collision = model<EFReflowCollision>(EFReflowCollision.STOP);

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        const next = this.collision();
        untracked(() => this._reflow.setConfig({ collision: next }));
      },
      { injector: this._injector },
    );
  }

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }
}
