export abstract class IPointerEvent {

  public get originalEvent(): (MouseEvent | TouchEvent) {
    return this.event;
  }

  public get targetElement(): HTMLElement {
    return this.target || this.originalEvent.target as HTMLElement;
  }

  protected constructor(private readonly event: (MouseEvent | TouchEvent), private target?: HTMLElement) {
    this.event = event;
  }

  public setTarget(target: HTMLElement): void {
    this.target = target;
  }

  public abstract isMouseLeftButton(): boolean;

  public abstract isMouseRightButton(): boolean;

  public preventDefault(): void {
    this.originalEvent.preventDefault();
  }

  public abstract getPosition(): { x: number, y: number };

  public get isEventInLockedContext(): boolean {
    return this.targetElement.closest('[fLockedContext]') !== null;
  }
}
