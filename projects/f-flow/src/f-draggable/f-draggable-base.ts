import { EventEmitter, InputSignalWithTransform } from '@angular/core';
import { FCreateConnectionEvent, FReassignConnectionEvent } from './f-connection';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FCreateNodeEvent } from '../f-external-item';
import { FDragStartedEvent, FNodeIntersectedWithConnections } from './domain';
import { FDropToGroupEvent } from './f-drop-to-group';
import { DragAndDropBase, ICanRunOutsideAngular } from '../drag-toolkit';
import { FMoveNodesEvent } from './f-node-move';

export abstract class FDraggableBase extends DragAndDropBase {
  public abstract fSelectionChange: EventEmitter<FSelectionChangeEvent>;

  public abstract fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>;

  public abstract fEmitOnNodeIntersect: boolean;

  public abstract fCreateNode: EventEmitter<FCreateNodeEvent>;

  public abstract fMoveNodes: EventEmitter<FMoveNodesEvent>;

  public abstract fReassignConnection: EventEmitter<FReassignConnectionEvent>;

  public abstract fCreateConnection: EventEmitter<FCreateConnectionEvent>;

  public abstract fDropToGroup: EventEmitter<FDropToGroupEvent>;

  public abstract vCellSize: InputSignalWithTransform<number, unknown>;

  public abstract hCellSize: InputSignalWithTransform<number, unknown>;

  public abstract fCellSizeWhileDragging: InputSignalWithTransform<boolean, unknown>;

  public abstract fDragStarted: EventEmitter<FDragStartedEvent>;

  public abstract fDragEnded: EventEmitter<void>;

  protected constructor(ngZone: ICanRunOutsideAngular | null) {
    super(ngZone || undefined);
  }
}
