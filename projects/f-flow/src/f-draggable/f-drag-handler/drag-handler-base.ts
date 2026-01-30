import { IPoint } from '@foblex/2d';
import { IPointerEvent } from '../../drag-toolkit';
import { FDragStartedEvent } from '../domain/f-drag-started-event';

export abstract class DragHandlerBase<TData> {
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

export type Ctor<T extends object = object> = abstract new (...args: unknown[]) => T;

export type DragDataFactory<THandler extends object, TData> = (handler: THandler) => TData;

export interface IDragHandlerMeta<THandler extends object, TData> {
  readonly type: string;
  readonly data?: DragDataFactory<THandler, TData>;
}

const DRAG_META = new WeakMap<object, IDragHandlerMeta<object, unknown>>();

export function FDragMeta<THandler extends object, TData>(
  meta: IDragHandlerMeta<THandler, TData>,
): (target: Ctor<THandler>) => void {
  return (target) => {
    DRAG_META.set(
      target as unknown as object,
      meta as unknown as IDragHandlerMeta<object, unknown>,
    );
  };
}

export function getDragMeta<THandler extends object, TData>(
  instance: THandler,
): IDragHandlerMeta<THandler, TData> | undefined {
  const ctor = instance.constructor as unknown as object;
  const meta = DRAG_META.get(ctor);

  return meta ? (meta as unknown as IDragHandlerMeta<THandler, TData>) : undefined;
}
