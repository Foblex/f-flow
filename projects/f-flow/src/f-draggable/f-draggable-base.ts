import { Directive, EventEmitter, } from '@angular/core';
import { FCreateConnectionEvent, FReassignConnectionEvent } from './connections';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FCreateNodeEvent } from '../f-external-item';
import { DragAndDropBase, ICanRunOutsideAngular } from '@foblex/drag-toolkit';

@Directive()
export abstract class FDraggableBase extends DragAndDropBase  {

  public abstract fSelectionChange: EventEmitter<FSelectionChangeEvent>;

  public abstract fCreateNode: EventEmitter<FCreateNodeEvent>;

  public abstract fReassignConnection: EventEmitter<FReassignConnectionEvent>;

  public abstract fCreateConnection: EventEmitter<FCreateConnectionEvent>;

  protected constructor(
    ngZone: ICanRunOutsideAngular | undefined
  ) {
    super(ngZone);
  }
}
