import { IDragHandler } from './i-drag-handler';
import { FDragStartedEvent } from './f-drag-started-event';
import { IPoint } from '@foblex/2d';
import { IPointerEvent } from '../../drag-toolkit';

export abstract class FDragHandlerBase<TData> implements IDragHandler<TData> {
  protected abstract readonly type: string;

  protected data(): TData | undefined {
    return undefined;
  }

  public getEvent(): FDragStartedEvent<TData> {
    const data = this.data();

    return data === undefined ? { fEventType: this.type } : { fEventType: this.type, fData: data };
  }

  public prepareDragSequence?(): void;
  public abstract onPointerMove(difference: IPoint, event?: IPointerEvent): void;
  public onPointerUp?(): void;
}
