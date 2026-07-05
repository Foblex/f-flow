import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  inject,
  Injector,
  input,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  untracked,
} from '@angular/core';
import { F_ZOOM, FZoomBase } from './f-zoom-base';
import { FMediator } from '@foblex/mediator';
import {
  defaultEventTrigger,
  FEventTrigger,
  isValidEventTrigger,
  ResetZoomRequest,
  ScrollCanvasRequest,
  SetZoomRequest,
} from '../domain';
import { FCanvasBase } from '../f-canvas';
import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { isNode } from '../f-node';
import { EFZoomDirection } from './e-f-zoom-direction';
import { EventExtensions } from '../f-draggable/infrastructure';
import {
  FComponentsStore,
  INSTANCES,
  RegisterPluginInstanceRequest,
  RemovePluginInstanceRequest,
} from '../f-storage';
import {
  isGestureWheelEvent,
  normalizeWheelStep,
  resolveScrollPanDelta,
  resolveWheelDelta,
} from './wheel-zoom.utils';
import {
  F_DEFAULT_CONTROL_SCHEME,
  FControlSchemeController,
  IFControlScheme,
} from '../plugins/interaction/f-control-scheme';

@Directive({
  selector: 'f-canvas[fZoom]',
  standalone: true,
  host: {
    'class': 'f-zoom f-component',
  },
  providers: [{ provide: F_ZOOM, useExisting: FZoomDirective }],
})
export class FZoomDirective extends FZoomBase implements OnInit, AfterViewInit, OnDestroy {
  private readonly _mediator = inject(FMediator);
  private readonly _injector = inject(Injector);
  private readonly _store = inject(FComponentsStore);
  private readonly _controlScheme = inject(FControlSchemeController, { optional: true });

  private _triggersListener = EventExtensions.emptyListener();
  private _wheelTrigger: FEventTrigger | undefined;

  public readonly isEnabled = input(false, { alias: 'fZoom', transform: booleanAttribute });

  /**
   * Overrides the active control scheme's wheel behavior when set — including its
   * `scrollPan` routing. Defaults to the scheme's `zoom` gesture.
   */
  @Input()
  public set fWheelTrigger(value: FEventTrigger) {
    this._wheelTrigger = value;
  }

  public get fWheelTrigger(): FEventTrigger {
    return this._wheelTrigger ?? this._scheme.zoom;
  }

  @Input()
  public fDblClickTrigger: FEventTrigger = defaultEventTrigger;

  @Input({ alias: 'fZoomMinimum', transform: numberAttribute })
  public override minimum: number = 0.1;

  @Input({ alias: 'fZoomMaximum', transform: numberAttribute })
  public override maximum: number = 4;

  @Input({ alias: 'fZoomStep', transform: numberAttribute })
  public override step: number = 0.1;

  /**
   * Separate zoom step for trackpad pinch (`Ctrl`/`Cmd` + wheel with pixel delta). When
   * `0` (default) pinch reuses `fZoomStep`.
   */
  @Input({ alias: 'fPinchStep', transform: numberAttribute })
  public pinchStep: number = 0;

  @Input({ alias: 'fZoomDblClickStep', transform: numberAttribute })
  public override dblClickStep: number = 0.5;

  /** Active control scheme (provider-driven, defaults to `F_DEFAULT_CONTROL_SCHEME`). */
  private get _scheme(): IFControlScheme {
    return this._controlScheme?.scheme() ?? F_DEFAULT_CONTROL_SCHEME;
  }

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  public ngOnInit(): void {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.ZOOM, this));
  }

  public ngAfterViewInit(): void {
    this._listenZoomEnabledChanges();
  }

  private _listenZoomEnabledChanges(): void {
    effect(
      () => {
        this.isEnabled();
        untracked(() => this._listenTriggers());
      },
      { injector: this._injector },
    );
  }

  private _listenTriggers(): void {
    if (!this._flowHost) {
      return;
    }

    this._disposeListeners();
    if (!this.isEnabled()) {
      return;
    }
    this._listen('wheel', this._onWheel, EventExtensions.activeListener());
    this._listen('dblclick', this._onDoubleClick);

    this._triggersListener = () => {
      this._unlisten('wheel', this._onWheel, EventExtensions.activeListener());
      this._unlisten('dblclick', this._onDoubleClick);
    };
  }

  private _onWheel = (event: WheelEvent) => {
    if (!this._wheelTrigger && this._scheme.scrollPan && !this._isZoomIntent(event)) {
      this._onScrollPan(event);

      return;
    }
    if (!isValidEventTrigger(event, this.fWheelTrigger)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (targetElement?.closest('[fLockedContext]')) {
      return;
    }

    const delta = resolveWheelDelta(event);
    if (delta === 0) {
      return;
    }

    const step = this._normalizeWheelStep(event, delta);
    if (step === 0) {
      return;
    }

    this.setZoom(
      PointExtensions.initialize(event.clientX, event.clientY),
      step,
      this._calculateDirection(delta),
      false,
    );
  };

  /** Ctrl/Cmd — including trackpad pinch, which the browser reports as ctrl+wheel — zooms. */
  private _isZoomIntent(event: WheelEvent): boolean {
    return event.ctrlKey || event.metaKey;
  }

  private _onScrollPan(event: WheelEvent): void {
    const targetElement = event.target as HTMLElement;
    if (targetElement?.closest('[fLockedContext]')) {
      return;
    }
    event.preventDefault();

    this._mediator.execute(new ScrollCanvasRequest(resolveScrollPanDelta(event)));
  }

  private _normalizeWheelStep(event: WheelEvent, delta: number): number {
    const step = isGestureWheelEvent(event) && this.pinchStep > 0 ? this.pinchStep : this.step;

    return normalizeWheelStep(event, delta, step);
  }

  private _calculateDirection(delta: number): number {
    return delta > 0 ? EFZoomDirection.ZOOM_OUT : EFZoomDirection.ZOOM_IN;
  }
  private _onDoubleClick = (event: MouseEvent) => {
    if (!isValidEventTrigger(event, this.fDblClickTrigger)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (isNode(targetElement) || targetElement?.closest('[fLockedContext]')) {
      return;
    }

    this.setZoom(
      PointExtensions.initialize(event.clientX, event.clientY),
      this.dblClickStep,
      EFZoomDirection.ZOOM_IN,
      true,
    );
  };

  private _getToCenterPosition(position: IPoint | undefined, rect: IRect): IPoint {
    return PointExtensions.initialize(
      position?.x || rect.gravityCenter.x,
      position?.y || rect.gravityCenter.y,
    );
  }

  public zoomIn(position?: IPoint): void {
    this._onZoomToCenter(EFZoomDirection.ZOOM_IN, position);
  }

  public zoomOut(position?: IPoint): void {
    this._onZoomToCenter(EFZoomDirection.ZOOM_OUT, position);
  }

  private _onZoomToCenter(direction: EFZoomDirection, position?: IPoint): void {
    this.setZoom(
      this._getToCenterPosition(position, RectExtensions.fromElement(this._flowHost)),
      this.step,
      direction,
      false,
    );
  }

  public setZoom(position: IPoint, step: number, direction: EFZoomDirection, animated: boolean) {
    this._mediator.execute(new SetZoomRequest(position, step, direction, animated));
  }

  public getZoomValue(): number {
    return this._canvas.transform.scale || 1;
  }

  public reset(): void {
    this._mediator.execute(new ResetZoomRequest());
  }

  private _disposeListeners(): void {
    this._triggersListener();
    this._triggersListener = EventExtensions.emptyListener();
  }

  public ngOnDestroy(): void {
    this._disposeListeners();
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.ZOOM));
  }

  private _listen<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this._flowHost.addEventListener(type, listener, options);
  }

  private _unlisten<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this._flowHost.removeEventListener(type, listener, options);
  }
}
