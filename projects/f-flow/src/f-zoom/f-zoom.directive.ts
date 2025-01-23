import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from "@angular/core";
import { F_ZOOM, FZoomBase } from './f-zoom-base';
import { FMediator } from '@foblex/mediator';
import {
  AddZoomToStoreRequest,
  Deprecated,
  EFTriggerEvent,
  GetCanvasRequest,
  GetFlowHostElementRequest,
  IFActionTrigger,
  RemoveZoomFromStoreRequest,
  ResetZoomRequest,
  SetZoomRequest
} from '../domain';
import { FCanvasBase } from '../f-canvas';
import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { isNode } from '../f-node';
import { EFZoomDirection } from './e-f-zoom-direction';
import { EFZoomAction } from './e-f-zoom-action';

@Directive({
  selector: "f-canvas[fZoom]",
  exportAs: 'fComponent',
  host: {
    'class': 'f-zoom f-component'
  },
  providers: [ { provide: F_ZOOM, useExisting: FZoomDirective } ],
})
export class FZoomDirective extends FZoomBase implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private _fMediator = inject(FMediator);
  private _rendered = inject(Renderer2);

  private _triggersListener: Function[] = [];

  private _isEnabled: boolean = false;

  @Input({ alias: 'fZoom', transform: booleanAttribute })
  protected set fZoom(isEnabled: boolean) {
    if (isEnabled !== this._isEnabled) {
      this._isEnabled = isEnabled;
      this._listenTriggers();
    }
  }

  @Input()
  public fZoomTriggers: IFActionTrigger<EFZoomAction>[] = [
    { event: EFTriggerEvent.WHEEL, action: EFZoomAction.WHEEL },
    { event: EFTriggerEvent.DOUBLE_CLICK, action: EFZoomAction.DOUBLE_CLICK }
  ];

  @Input({ alias: 'fZoomMinimum', transform: numberAttribute })
  public override minimum: number = 0.1;

  @Input({ alias: 'fZoomMaximum', transform: numberAttribute })
  public override maximum: number = 4;

  @Input({ alias: 'fZoomStep', transform: numberAttribute })
  public override step: number = 0.1;

  @Input({ alias: 'fZoomDblClickStep', transform: numberAttribute })
  public override dblClickStep: number = 0.5;

  private get _fHost(): HTMLElement {
    return this._fMediator.execute(new GetFlowHostElementRequest());
  }

  private get _fCanvas(): FCanvasBase {
    return this._fMediator.execute(new GetCanvasRequest());
  }

  public ngOnInit(): void {
    this._fMediator.execute(new AddZoomToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    this._listenTriggers();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'fZoomTriggers' ]) {
      this._listenTriggers();
    }
  }

  private _listenTriggers(): void {
    if (!this._fHost) {
      return;
    }

    this._disposeListeners();
    this._validateTriggers();

    this.fZoomTriggers.forEach((x) => {
      this._triggersListener.push(
        this._rendered.listen(this._fHost, x.event, this._getAction(x))
      );
    });
  }

  private _validateTriggers(): void {

    const SUPPORTED_EVENTS = Object.values(EFTriggerEvent);
    const SUPPORTED_ACTIONS = Object.values(EFZoomAction);

    this.fZoomTriggers.forEach((trigger) => {
      if (!SUPPORTED_EVENTS.includes(trigger.event)) {
        throw new Error(`Unsupported event: ${ trigger.event }`);
      }

      if (!SUPPORTED_ACTIONS.includes(trigger.action)) {
        throw new Error(`Unsupported action: ${ trigger.action }`);
      }
    });
  }

  private _getAction(trigger: IFActionTrigger): (event: Event) => void {
    switch (trigger.action) {
      case EFZoomAction.WHEEL:
        return (event: Event) => this._onWheel(event as WheelEvent, trigger);
      case EFZoomAction.DOUBLE_CLICK:
        return (event: Event) => this._onDoubleClick(event as MouseEvent, trigger);
      default:
        throw new Error(`Unknown action: ${ trigger.action }`);
    }
  }

  private _onWheel = (event: WheelEvent, trigger: IFActionTrigger) => {
    if (trigger.validator && !trigger.validator(event)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (targetElement?.closest('[fLockedContext]')) {
      return;
    }

    this.setZoom(
      PointExtensions.initialize(event.clientX, event.clientY),
      this.step, this._calculateDirection(event.deltaY), false
    );
  }

  private _calculateDirection(deltaY: number): number {
    return deltaY > 0 ? EFZoomDirection.ZOOM_OUT : EFZoomDirection.ZOOM_IN;
  }

  private _onDoubleClick = (event: MouseEvent, trigger: IFActionTrigger) => {
    if (trigger.validator && !trigger.validator(event)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (isNode(targetElement) || targetElement?.closest('[fLockedContext]')) {
      return;
    }

    this.setZoom(
      PointExtensions.initialize(event.clientX, event.clientY),
      this.dblClickStep, EFZoomDirection.ZOOM_IN, true
    );
  }

  private _getToCenterPosition(position: IPoint | undefined, rect: IRect): IPoint {
    return PointExtensions.initialize(position?.x || rect.gravityCenter.x, position?.y || rect.gravityCenter.y);
  }

  public zoomIn(position?: IPoint): void {
    this._onZoomToCenter(EFZoomDirection.ZOOM_IN, position);
  }

  public zoomOut(position?: IPoint): void {
    this._onZoomToCenter(EFZoomDirection.ZOOM_OUT, position);
  }

  private _onZoomToCenter(direction: EFZoomDirection, position?: IPoint): void {
    this.setZoom(
      this._getToCenterPosition(position, RectExtensions.fromElement(this._fHost)),
      this.step, direction, false
    );
  }

  public setZoom(position: IPoint, step: number, direction: EFZoomDirection, animated: boolean) {
    this._fMediator.execute(
      new SetZoomRequest(position, step, direction, animated)
    );
  }

  /**
   *  @deprecated Method "getScale" is deprecated. Use "getZoomValue" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('getZoomValue')
  public getScale(): number {
    return this.getZoomValue();
  }

  public getZoomValue(): number {
    return this._fCanvas.transform.scale || 1;
  }

  public reset(): void {
    this._fMediator.execute(new ResetZoomRequest());
  }

  private _disposeListeners(): void {
    this._triggersListener.forEach((listener) => listener());
    this._triggersListener = [];
  }

  public ngOnDestroy(): void {
    this._disposeListeners();
    this._fMediator.execute(new RemoveZoomFromStoreRequest());
  }
}
