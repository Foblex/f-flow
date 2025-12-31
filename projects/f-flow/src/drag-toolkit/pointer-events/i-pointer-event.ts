export abstract class IPointerEvent {
  public get originalEvent(): MouseEvent | TouchEvent {
    return this._event;
  }

  public get targetElement(): HTMLElement {
    return this._target || (this.originalEvent.target as HTMLElement);
  }

  protected constructor(
    private readonly _event: MouseEvent | TouchEvent,
    private _target?: HTMLElement,
  ) {}

  public setTarget(target: HTMLElement): void {
    this._target = target;
  }

  public abstract isMouseLeftButton(): boolean;

  public abstract isMouseRightButton(): boolean;

  public preventDefault(): void {
    this.originalEvent.preventDefault();
  }

  public abstract getPosition(): { x: number; y: number };

  public get isEventInLockedContext(): boolean {
    return this.targetElement.closest('[fLockedContext]') !== null;
  }
}
