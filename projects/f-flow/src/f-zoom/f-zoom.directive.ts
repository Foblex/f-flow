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
  AddZoomToStoreRequest,
  defaultEventTrigger,
  Deprecated,
  FEventTrigger,
  GetCanvasRequest,
  GetFlowHostElementRequest,
  isValidEventTrigger,
  RemoveZoomFromStoreRequest,
  ResetZoomRequest,
  SetZoomRequest,
} from '../domain';
import { FCanvasBase } from '../f-canvas';
import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { isNode } from '../f-node';
import { EFZoomDirection } from './e-f-zoom-direction';
import { EventExtensions } from '../drag-toolkit';

const PINCH_NORMALIZATION_FACTOR = 100;
const PINCH_MOVEMENT_THRESHOLD = 0.5;
const NORMALIZED_MIN = 0.1;
const NORMALIZED_MAX = 1;

@Directive({
  selector: 'f-canvas[fZoom]',
  exportAs: 'fComponent',
  standalone: true,
  host: {
    'class': 'f-zoom f-component',
  },
  providers: [{ provide: F_ZOOM, useExisting: FZoomDirective }],
})
export class FZoomDirective extends FZoomBase implements OnInit, AfterViewInit, OnDestroy {
  private readonly _mediator = inject(FMediator);
  private readonly _injector = inject(Injector);

  private _triggersListener = EventExtensions.emptyListener();
  private _pinchDistance: number | null = null;

  public readonly isEnabled = input(false, { alias: 'fZoom', transform: booleanAttribute });

  @Input()
  public fWheelTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fDblClickTrigger: FEventTrigger = defaultEventTrigger;

  @Input({ alias: 'fZoomMinimum', transform: numberAttribute })
  public override minimum: number = 0.1;

  @Input({ alias: 'fZoomMaximum', transform: numberAttribute })
  public override maximum: number = 4;

  @Input({ alias: 'fZoomStep', transform: numberAttribute })
  public override step: number = 0.1;

  @Input({ alias: 'fZoomDblClickStep', transform: numberAttribute })
  public override dblClickStep: number = 0.5;

  private get _hostElement(): HTMLElement {
    return this._mediator.execute(new GetFlowHostElementRequest());
  }

  private get _canvas(): FCanvasBase {
    return this._mediator.execute(new GetCanvasRequest());
  }

  public ngOnInit(): void {
    this._mediator.execute(new AddZoomToStoreRequest(this));
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
    if (!this._hostElement) {
      return;
    }

    this._disposeListeners();
    if (!this.isEnabled()) {
      return;
    }
    this._listen('wheel', this._onWheel, EventExtensions.activeListener());
    this._listen('dblclick', this._onDoubleClick);
    this._listen('touchstart', this._onTouchStart, EventExtensions.activeListener());
    this._listen('touchmove', this._onTouchMove, EventExtensions.activeListener());
    this._listen('touchend', this._onTouchEnd);
    this._listen('touchcancel', this._onTouchEnd);

    this._triggersListener = () => {
      this._unlisten('wheel', this._onWheel, EventExtensions.activeListener());
      this._unlisten('dblclick', this._onDoubleClick);
      this._unlisten('touchstart', this._onTouchStart, EventExtensions.activeListener());
      this._unlisten('touchmove', this._onTouchMove, EventExtensions.activeListener());
      this._unlisten('touchend', this._onTouchEnd);
      this._unlisten('touchcancel', this._onTouchEnd);
    };
  }

  private _onWheel = (event: WheelEvent) => {
    if (!isValidEventTrigger(event, this.fWheelTrigger)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (targetElement?.closest('[fLockedContext]')) {
      return;
    }

    const step = this._normalizeWheelStep(event.deltaY);
    this.setZoom(
      PointExtensions.initialize(event.clientX, event.clientY),
      step,
      this._calculateDirection(event.deltaY),
      false,
    );
  };

  private _normalizeWheelStep(deltaY: number): number {
    const intensity = Math.abs(deltaY) / 100;
    const normalized = Math.max(NORMALIZED_MIN, Math.min(intensity, NORMALIZED_MAX));

    return this.step * normalized;
  }

  private _calculateDirection(deltaY: number): number {
    return deltaY > 0 ? EFZoomDirection.ZOOM_OUT : EFZoomDirection.ZOOM_IN;
  }

  private _onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 2 || this._isLockedContext(event.target)) {
      this._resetPinch();

      return;
    }

    this._pinchDistance = this._getTouchDistance(event.touches);
  };

  private _onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 2 || this._pinchDistance === null) {
      return;
    }

    if (this._isLockedContext(event.target)) {
      this._resetPinch();

      return;
    }

    const currentDistance = this._getTouchDistance(event.touches);
    const delta = currentDistance - this._pinchDistance;
    if (Math.abs(delta) < PINCH_MOVEMENT_THRESHOLD) {
      return;
    }

    event.preventDefault();

    this.setZoom(
      this._getTouchCenter(event.touches),
      this._normalizePinchStep(delta),
      delta > 0 ? EFZoomDirection.ZOOM_IN : EFZoomDirection.ZOOM_OUT,
      false,
    );

    this._pinchDistance = currentDistance;
  };

  private _onTouchEnd = () => {
    this._resetPinch();
  };

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

  private _getTouchDistance(touches: TouchList): number {
    const firstTouch = touches[0];
    const secondTouch = touches[1];

    return Math.hypot(
      secondTouch.clientX - firstTouch.clientX,
      secondTouch.clientY - firstTouch.clientY,
    );
  }

  private _getTouchCenter(touches: TouchList): IPoint {
    const firstTouch = touches[0];
    const secondTouch = touches[1];

    return PointExtensions.initialize(
      (firstTouch.clientX + secondTouch.clientX) / 2,
      (firstTouch.clientY + secondTouch.clientY) / 2,
    );
  }

  private _normalizePinchStep(delta: number): number {
    const intensity = Math.abs(delta) / PINCH_NORMALIZATION_FACTOR;
    const normalized = Math.max(NORMALIZED_MIN, Math.min(intensity, NORMALIZED_MAX));

    return this.step * normalized;
  }

  private _resetPinch(): void {
    this._pinchDistance = null;
  }

  private _isLockedContext(target: EventTarget | null): boolean {
    return !!(target as HTMLElement | null)?.closest('[fLockedContext]');
  }

  public zoomIn(position?: IPoint): void {
    this._onZoomToCenter(EFZoomDirection.ZOOM_IN, position);
  }

  public zoomOut(position?: IPoint): void {
    this._onZoomToCenter(EFZoomDirection.ZOOM_OUT, position);
  }

  private _onZoomToCenter(direction: EFZoomDirection, position?: IPoint): void {
    this.setZoom(
      this._getToCenterPosition(position, RectExtensions.fromElement(this._hostElement)),
      this.step,
      direction,
      false,
    );
  }

  public setZoom(position: IPoint, step: number, direction: EFZoomDirection, animated: boolean) {
    this._mediator.execute(new SetZoomRequest(position, step, direction, animated));
  }

  /**
   *  @deprecated Method "getScale" is deprecated. Use "getZoomValue" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('getZoomValue')
  public getScale(): number {
    return this.getZoomValue();
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
    this._mediator.execute(new RemoveZoomFromStoreRequest());
  }

  private _listen<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this._hostElement.addEventListener(type, listener, options);
  }

  private _unlisten<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this._hostElement.removeEventListener(type, listener, options);
  }
}
