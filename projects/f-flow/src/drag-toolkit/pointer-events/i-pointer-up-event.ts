import { IPointerEvent } from "./i-pointer-event";

export class IPointerUpEvent extends IPointerEvent {

  constructor(event: PointerEvent, target?: HTMLElement) {
    super(event, target);
  }

  public isMouseLeftButton(): boolean {
    const evt = this.originalEvent as PointerEvent;

    return evt.pointerType === 'mouse' && evt.button === 0 || evt.pointerType === 'touch';
  }

  public isMouseRightButton(): boolean {
    const evt = this.originalEvent as PointerEvent;

    return evt.pointerType === 'mouse' && evt.button === 2 || evt.pointerType === 'touch';
  }

  public getPosition(): { x: number, y: number } {
    const evt = this.originalEvent as PointerEvent;

    return { x: evt.clientX, y: evt.clientY };
  }

  public getPointerType(): string {
    return (this.originalEvent as PointerEvent).pointerType;
  }

  public getPointerId(): number {
    return (this.originalEvent as PointerEvent).pointerId;
  }
}
