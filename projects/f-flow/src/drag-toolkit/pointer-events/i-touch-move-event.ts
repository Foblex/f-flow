import { IPointerEvent } from './i-pointer-event';

export class ITouchMoveEvent extends IPointerEvent {

  constructor(event: TouchEvent, target?: HTMLElement) {
    super(event, target);
  }

  public isMouseLeftButton(): boolean {
    return true;
  }

  public isMouseRightButton(): boolean {
    return false;
  }

  public getPosition(): { x: number, y: number } {
    const touch = (this.originalEvent as TouchEvent).targetTouches[0];

    return { x: touch.clientX, y: touch.clientY };
  }
}
