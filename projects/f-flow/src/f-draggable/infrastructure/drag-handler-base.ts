import { IPoint } from '@foblex/2d';
import { IPointerEvent } from '../../drag-toolkit';
import { FDragStartedEvent } from '../domain/f-drag-started-event';

export abstract class DragHandlerBase<TData> {
  protected abstract readonly type: string;
  protected abstract readonly kind: string;

  protected data(): TData | undefined {
    return undefined;
  }

  public getEvent(): FDragStartedEvent<TData> {
    return new FDragStartedEvent(this.kind, this.data(), this.type);
  }

  public prepareDragSequence?(): void;
  public abstract onPointerMove(difference: IPoint, event?: IPointerEvent): void;
  public onPointerUp?(): void;

  public destroy?(): void;
}
