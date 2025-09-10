import { IPointerEvent } from './i-pointer-event';

export class ITouchDownEvent extends IPointerEvent {

  constructor(event: TouchEvent) {
    super(event);
  }

  public isMouseLeftButton(): boolean {
    return true;
  }

  public isMouseRightButton(): boolean {
    return false;
  }

  public getPosition(): { x: number, y: number } {
    const touches = (this.originalEvent as TouchEvent).touches;

    return { x: touches[ 0 ].clientX, y: touches[ 0 ].clientY };
  }
}
