import { IPointerEvent } from '@foblex/drag-toolkit';
import { InjectionToken } from '@angular/core';

export const F_DRAG_AND_DROP_PLUGIN: InjectionToken<IFDragAndDropPlugin> = new InjectionToken<IFDragAndDropPlugin>('F_DRAG_AND_DROP_PLUGIN');

export interface IFDragAndDropPlugin {

  onSelect?(event: Event): void;

  onPointerDown?(event: IPointerEvent): void;

  prepareDragSequence?(event: IPointerEvent): void;

  onPointerUp?(event: IPointerEvent): void;
}
