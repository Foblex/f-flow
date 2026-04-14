import { IPoint } from '@foblex/2d';
import { IPointerEvent } from '../../drag-toolkit';

export class StoredPointerEvent extends IPointerEvent {
  private readonly _position: IPoint;
  private readonly _isMouseLeftButton: boolean;
  private readonly _isMouseRightButton: boolean;

  constructor(event: IPointerEvent) {
    super(event.originalEvent, event.targetElement);

    this._position = event.getPosition();
    this._isMouseLeftButton = event.isMouseLeftButton();
    this._isMouseRightButton = event.isMouseRightButton();
  }

  public isMouseLeftButton(): boolean {
    return this._isMouseLeftButton;
  }

  public isMouseRightButton(): boolean {
    return this._isMouseRightButton;
  }

  public getPosition(): IPoint {
    return { ...this._position };
  }
}

export function storePointerEvent(event: IPointerEvent): IPointerEvent {
  return new StoredPointerEvent(event);
}
