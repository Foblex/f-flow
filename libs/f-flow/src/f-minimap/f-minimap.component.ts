import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import {
  FComponentsStore,
  INSTANCES,
  ListenTransformChangesRequest,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';
import { debounceAnimationFrame, FChannelHub, notifyOnStart } from '../reactivity';
import { BrowserService } from '@foblex/platform';
import { F_MINIMAP_BASE, FMinimapBase } from './f-minimap-base';

@Component({
  selector: 'f-minimap',
  templateUrl: './f-minimap.component.html',
  styleUrls: ['./f-minimap.component.scss'],
  exportAs: 'fComponent',
  host: {
    'class': 'f-component f-minimap',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [{ provide: F_MINIMAP_BASE, useExisting: FMinimapComponent }],
  imports: [FMinimapFlowDirective, FMinimapCanvasDirective, FMinimapViewDirective],
})
export class FMinimapComponent extends FMinimapBase implements AfterViewInit, OnInit, OnDestroy {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);

  public readonly _canvas = viewChild.required(FMinimapCanvasDirective);
  public readonly _flow = viewChild.required(FMinimapFlowDirective);
  public readonly _minimapView = viewChild.required(FMinimapViewDirective);

  public readonly fMinSize = input<number>(1000);
  public readonly fNodeRenderLimit = input<number, unknown>(1500, { transform: numberAttribute });

  public override get state() {
    return this._flow().model;
  }

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MINIMAP, this));
  }

  public ngAfterViewInit(): void {
    this._listenTransformChanges();
  }

  private _listenTransformChanges(): void {
    this._mediator
      .execute<FChannelHub>(new ListenTransformChangesRequest())
      .pipe(notifyOnStart(), debounceAnimationFrame())
      .listen(this._destroyRef, () => {
        this._redraw();
      });
  }

  private _redraw(): void {
    if (!this._browser.isBrowser()) {
      return;
    }

    if (this._isOverNodeRenderLimit()) {
      this._canvas().clear();

      return;
    }

    this._flow().redraw();
    this._minimapView().redraw();
    this._canvas().redraw();
  }

  private _isOverNodeRenderLimit(): boolean {
    const limit = this.fNodeRenderLimit();

    return limit > 0 && this._store.nodes.size() > limit;
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MINIMAP));
  }
}
