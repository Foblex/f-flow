import { Directive, EventEmitter, } from '@angular/core';
import { FCreateConnectionEvent, FReassignConnectionEvent } from './f-connection';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FCreateNodeEvent } from '../f-external-item';
import { FDragStartedEvent, FNodeIntersectedWithConnections } from './domain';
import { FDropToGroupEvent } from './f-drop-to-group';
import {DragAndDropBase, ICanRunOutsideAngular} from "../drag-toolkit";

@Directive()
export abstract class FDraggableBase extends DragAndDropBase  {

  public abstract fSelectionChange: EventEmitter<FSelectionChangeEvent>;

  public abstract fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>;

  public abstract fEmitOnNodeIntersect: boolean;

  public abstract fCreateNode: EventEmitter<FCreateNodeEvent>;

  public abstract fReassignConnection: EventEmitter<FReassignConnectionEvent>;

  public abstract fCreateConnection: EventEmitter<FCreateConnectionEvent>;

  public abstract fDropToGroup: EventEmitter<FDropToGroupEvent>;

  public abstract vCellSize: number;

  public abstract hCellSize: number;

  public abstract fCellSizeWhileDragging: boolean;

  public abstract fDragStarted: EventEmitter<FDragStartedEvent>;

  public abstract fDragEnded: EventEmitter<void>;

  protected constructor(
    ngZone: ICanRunOutsideAngular | undefined
  ) {
    super(ngZone);
  }
}
