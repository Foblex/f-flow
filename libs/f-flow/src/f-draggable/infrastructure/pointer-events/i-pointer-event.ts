import { getEventTargetElement } from '../../../utils/get-event-target-element';

export abstract class IPointerEvent {
  public get originalEvent(): MouseEvent | TouchEvent {
    return this._event;
  }

  public get targetElement(): HTMLElement {
    return this._target;
  }

  public get touchEvent(): TouchEvent {
    return this._event as TouchEvent;
  }

  public get touches(): TouchList {
    return this.touchEvent.touches;
  }

  private _target: HTMLElement;

  protected constructor(
    private readonly _event: MouseEvent | TouchEvent,
    target?: HTMLElement,
  ) {
    // Drag preparation may run after dispatch, when composedPath() is already empty.
    this._target =
      target ?? (getEventTargetElement(_event, 'f-flow, .f-external-item') as HTMLElement);
  }

  public setTarget(target: HTMLElement): void {
    this._target = target;
  }

  public abstract isMouseLeftButton(): boolean;

  public abstract isMouseMiddleButton(): boolean;

  public abstract isMouseRightButton(): boolean;

  public preventDefault(): void {
    this.originalEvent.preventDefault();
  }

  public abstract getPosition(): { x: number; y: number };

  public get isEventInLockedContext(): boolean {
    return this.targetElement.closest('[fLockedContext]') !== null;
  }
}
