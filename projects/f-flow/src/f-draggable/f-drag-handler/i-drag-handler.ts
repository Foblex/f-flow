import { IPoint } from '@foblex/2d';
import { IPointerEvent } from '../../drag-toolkit';
import { FDragStartedEvent } from './f-drag-started-event';

export interface IDragHandler<TData> {
  prepareDragSequence?(): void;
  onPointerMove(difference: IPoint, event?: IPointerEvent): void;
  onPointerUp?(): void;

  getEvent(): FDragStartedEvent<TData>;
}
