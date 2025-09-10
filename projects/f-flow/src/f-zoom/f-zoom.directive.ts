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
  SimpleChanges,
} from "@angular/core";
import { F_ZOOM, FZoomBase } from './f-zoom-base';
import { FMediator } from '@foblex/mediator';
import {
  AddZoomToStoreRequest, defaultEventTrigger,
  Deprecated,
  FEventTrigger,
  GetCanvasRequest,
  GetFlowHostElementRequest, isValidEventTrigger,
  RemoveZoomFromStoreRequest,
  ResetZoomRequest,
  SetZoomRequest,
} from '../domain';
import { FCanvasBase } from '../f-canvas';
import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { isNode } from '../f-node';
import { EFZoomDirection } from './e-f-zoom-direction';

@Directive({
  selector: "f-canvas[fZoom]",
  exportAs: 'fComponent',
  standalone: true,
  host: {
    'class': 'f-zoom f-component',
  },
  providers: [ { provide: F_ZOOM, useExisting: FZoomDirective } ],
})
export class FZoomDirective extends FZoomBase implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private _fMediator = inject(FMediator);
  private _rendered = inject(Renderer2);

  private _triggersListener: (() => void)[] = [];

  @Input({ alias: 'fZoom', transform: booleanAttribute })
  public isEnabled: boolean = false;

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
    if (changes[ 'isEnabled' ]) {
      this._listenTriggers();
    }
  }

  private _listenTriggers(): void {
    if (!this._fHost) {
      return;
    }

    this._disposeListeners();
    if (!this.isEnabled) {
      return;
    }

    this._triggersListener.push(this._rendered.listen(this._fHost, 'wheel', this._onWheel));
    this._triggersListener.push(this._rendered.listen(this._fHost, 'dblclick', this._onDoubleClick));
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
  }

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
      this.dblClickStep, EFZoomDirection.ZOOM_IN, true,
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
      this.step, direction, false,
    );
  }

  public setZoom(position: IPoint, step: number, direction: EFZoomDirection, animated: boolean) {
    this._fMediator.execute(
      new SetZoomRequest(position, step, direction, animated),
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
