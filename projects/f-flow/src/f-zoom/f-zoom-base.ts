import { EventExtensions } from '@foblex/drag-toolkit';
import { IPoint, Point, RectExtensions } from '@foblex/2d';
import { inject, InjectionToken } from '@angular/core';
import { FCanvasBase } from '../f-canvas';
import { isNode } from '../f-node';
import { FMediator } from '@foblex/mediator';
import { GetCanvasRequest, GetFlowHostElementRequest } from '../domain';
import { IsDragStartedRequest } from '../domain';

export const F_ZOOM = new InjectionToken<FZoomBase>('F_ZOOM');

export abstract class FZoomBase {

  protected isEnabled: boolean = false;

  public abstract minimum: number;
  public abstract maximum: number;

  public abstract step: number;
  public abstract dblClickStep: number;

  private _listeners: Function = EventExtensions.emptyListener();

  private _fMediator = inject(FMediator);

  private get _fFlowHostElement(): HTMLElement {
    return this._fMediator.send(new GetFlowHostElementRequest());
  }

  private get _fCanvas(): FCanvasBase {
    return this._fMediator.send(new GetCanvasRequest());
  }

  private get _isDragStarted(): boolean {
    return this._fMediator.send<boolean>(new IsDragStartedRequest());
  }

  protected toggleZoom(): void {
    if (this.isEnabled) {
      this._subscribe();
    } else {
      this.dispose();
    }
  }

  private _subscribe(): void {
    this._listeners();
    if (!this._fFlowHostElement) {
      return;
    }

    this._fFlowHostElement.addEventListener('wheel', this._onWheel);
    this._fFlowHostElement.addEventListener('dblclick', this._onDoubleClick);
    this._listeners = () => {
      this._fFlowHostElement.removeEventListener('wheel', this._onWheel);
      this._fFlowHostElement.removeEventListener('dblclick', this._onDoubleClick);
    };
  }

  public getScale(): number {
    return this._fCanvas.transform.scale || 1;
  }

  private _onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (this._isDragStarted || targetElement?.closest('[fLockedContext]')) {
      return;
    }

    let result: number = this.getScale();

    const direction = event.deltaY > 0 ? -1 : 1;
    const step = this.step;
    result = result + step * direction;

    result = Math.max(this.minimum, Math.min(result, this.maximum));

    const pointerPositionInFlow = new Point(event.clientX, event.clientY).elementTransform(this._fFlowHostElement);

    this._fCanvas.setZoom(result, pointerPositionInFlow);
    this._fCanvas.redraw();
    this._fCanvas.emitCanvasChangeEvent();
  }

  private _onDoubleClick = (event: MouseEvent) => {
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (this._isDragStarted || isNode(targetElement) || targetElement?.closest('[fLockedContext]')) {
      return;
    }

    let result: number = this.getScale();

    const direction = 1;
    const step = this.dblClickStep;
    result = result + step * direction;

    result = Math.max(this.minimum, Math.min(result, this.maximum));

    const pointerPositionInFlow = new Point(event.clientX, event.clientY).elementTransform(this._fFlowHostElement);
    this._fCanvas.setZoom(result, pointerPositionInFlow);
    this._fCanvas.redrawWithAnimation();
    this._fCanvas.emitCanvasChangeEvent();
  }

  private _onZoomToCenter(deltaY: number, position?: IPoint): void {
    const preventDefault = () => {
    };
    const rect = RectExtensions.fromElement(this._fFlowHostElement);

    this._onWheel({
      deltaY, preventDefault, clientX: position?.x || rect.gravityCenter.x, clientY: position?.y || rect.gravityCenter.y
    } as WheelEvent);
  }

  public zoomIn(position?: IPoint): void {
    this._onZoomToCenter(-1, position);
  }

  public zoomOut(position?: IPoint): void {
    this._onZoomToCenter(1, position);
  }

  public reset(): void {
    this._fCanvas.resetZoom();
    this._fCanvas.redraw();
    this._fCanvas.emitCanvasChangeEvent();
  }

  protected dispose(): void {
    this._listeners();
    this._listeners = EventExtensions.emptyListener();
  }
}
