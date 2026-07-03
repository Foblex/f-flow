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
  F_DEFAULT_CONTROL_SCHEME,
  F_DRAG_SELECT_CONTROL_SCHEME,
  F_SCROLL_PAN_CONTROL_SCHEME,
  FCanvasComponent,
  FControlSchemeController,
  FFlowModule,
  IFControlScheme,
  provideFFlow,
  withControlScheme,
} from '@foblex/flow';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

type SchemeKey = 'default' | 'scroll-pan' | 'drag-select';

@Component({
  selector: 'control-schemes',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent],
  providers: [provideFFlow(withControlScheme(F_DEFAULT_CONTROL_SCHEME))],
})
export class Example implements OnInit {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _controlScheme = inject(FControlSchemeController);
  private readonly _injector = inject(Injector);
  private readonly _presets: Record<SchemeKey, IFControlScheme> = {
    'default': F_DEFAULT_CONTROL_SCHEME,
    'scroll-pan': F_SCROLL_PAN_CONTROL_SCHEME,
    'drag-select': F_DRAG_SELECT_CONTROL_SCHEME,
  };

  protected readonly schemes: KeyValue<SchemeKey, string>[] = [
    { key: 'default', value: 'Default' },
    { key: 'scroll-pan', value: 'Scroll Pan (Miro-like)' },
    { key: 'drag-select', value: 'Drag Select (draw.io-like)' },
  ];
  protected readonly scheme = model<SchemeKey>('default');

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        const next = this.scheme();
        untracked(() => this._controlScheme.setScheme(this._presets[next]));
      },
      { injector: this._injector },
    );
  }

  protected loaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }
}
