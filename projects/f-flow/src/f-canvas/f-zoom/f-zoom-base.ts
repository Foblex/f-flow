import { EventExtensions, IPoint, Point, RectExtensions } from '@foblex/core';
import { InjectionToken } from '@angular/core';
import { FComponentsStore } from '../../f-storage';
import { isNode } from '../../f-node';
import { FCanvasBase } from '../f-canvas-base';

export const F_ZOOM = new InjectionToken<FZoomBase>('F_ZOOM');

export abstract class FZoomBase {

  protected isEnabled: boolean = false;

  public abstract minimum: number;
  public abstract maximum: number;

  public abstract step: number;
  public abstract dblClickStep: number;

  private listeners: Function = EventExtensions.emptyListener();

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.flowHost;
  }

  private get fCanvas(): FCanvasBase {
    return this.fComponentsStore.fCanvas as FCanvasBase;
  }

  protected constructor(
      protected fComponentsStore: FComponentsStore
  ) {
  }

  protected toggleZoom(): void {
    if (this.isEnabled) {
      this.subscribe();
    } else {
      this.unsubscribe();
    }
  }

  private subscribe(): void {
    this.listeners();
    if (!this.flowHost) {
      return;
    }

    this.flowHost.addEventListener('wheel', this.onWheel.bind(this));
    this.flowHost.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.listeners = () => {
      this.flowHost.removeEventListener('wheel', this.onWheel.bind(this));
      this.flowHost.removeEventListener('dblclick', this.onDoubleClick.bind(this));
    };
  }

  public getScale(): number {
    return this.fCanvas.transform.scale || 1;
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    if (this.fComponentsStore.fDraggable?.isDragStarted) {
      return;
    }

    let result: number = this.getScale();

    const direction = event.deltaY > 0 ? -1 : 1;
    const step = this.step;
    result = result + step * direction;

    result = Math.max(this.minimum, Math.min(result, this.maximum));

    const pointerPositionInFlow = new Point(event.clientX, event.clientY).elementTransform(this.flowHost);

    this.fCanvas.setZoom(result, pointerPositionInFlow);
    this.fCanvas.redraw();
    this.fCanvas.completeDrag();
  }

  private onDoubleClick(event: MouseEvent): void {
    event.preventDefault();

    if (this.fComponentsStore.fDraggable?.isDragStarted || isNode(event.target as HTMLElement)) {
      return;
    }

    let result: number = this.getScale();

    const direction = 1;
    const step = this.dblClickStep;
    result = result + step * direction;

    result = Math.max(this.minimum, Math.min(result, this.maximum));

    const pointerPositionInFlow = new Point(event.clientX, event.clientY).elementTransform(this.flowHost);
    this.fCanvas.setZoom(result, pointerPositionInFlow);
    this.fCanvas.redrawWithAnimation();
    this.fCanvas.completeDrag();
  }

  private onZoomToCenter(deltaY: number, position?: IPoint): void {
    const preventDefault = () => {
    };
    const rect = RectExtensions.fromElement(this.flowHost);

    this.onWheel({
      deltaY, preventDefault, clientX: position?.x || rect.gravityCenter.x, clientY: position?.y || rect.gravityCenter.y
    } as WheelEvent);
  }

  public zoomIn(position?: IPoint): void {
    this.onZoomToCenter(-1, position);
  }

  public zoomOut(position?: IPoint): void {
    this.onZoomToCenter(1, position);
  }

  public reset(): void {
    this.fCanvas.resetZoom();
    this.fCanvas.redraw();
    this.fCanvas.completeDrag();
  }

  protected unsubscribe(): void {
    this.listeners();
    this.listeners = EventExtensions.emptyListener();
  }
}
