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

    this._triggersListener = () => {
      this._unlisten('wheel', this._onWheel, EventExtensions.activeListener());
      this._unlisten('dblclick', this._onDoubleClick);
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
    const normalized = Math.max(0.1, Math.min(intensity, 1));

    return this.step * normalized;
  }

  private _calculateDirection(deltaY: number): number {
    return deltaY > 0 ? EFZoomDirection.ZOOM_OUT : EFZoomDirection.ZOOM_IN;
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
      this._getToCenterPosition(position, RectExtensions.fromElement(this._hostElement)),
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
