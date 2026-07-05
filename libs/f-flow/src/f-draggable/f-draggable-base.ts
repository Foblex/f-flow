import {
  ElementRef,
  EventEmitter,
  inject,
  InputSignalWithTransform,
  OutputEmitterRef,
} from '@angular/core';
import {
  FConnectionWaypointsChangedEvent,
  FCreateConnectionEvent,
  FReassignConnectionEvent,
} from './connection';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FDropToGroupEvent } from './drop-to-group';
import { DragAndDropBase } from './infrastructure';
import { FMoveNodesEvent } from './drag-node';
import { FDragStartedEvent } from './f-drag-started-event';
import { FNodeConnectionsIntersectionEvent, FNodeIntersectedWithConnections } from './domain';
import { FCreateNodeEvent } from './drag-external-item';
import { FDeleteSelectedEvent } from './f-delete-selected-event';
import { FEventTrigger } from '../domain';

export abstract class FDraggableBase extends DragAndDropBase {
  public readonly hostElement = inject(ElementRef).nativeElement;

  public abstract fSelectionChange: EventEmitter<FSelectionChangeEvent>;

  /**
   * Emitted when the user requests removal of the current selection (keyboard
   * `Delete`/`Backspace` from the accessibility layer). The library never mutates the
   * graph — remove the items from your data and the flow follows.
   */
  public abstract fDeleteSelected: EventEmitter<FDeleteSelectedEvent>;

  /** The active create-connection gesture gate (input override or the control scheme's). */
  public abstract fCreateConnectionTrigger: FEventTrigger;

  /** @deprecated Use `fNodeConnectionsIntersection` */
  public abstract fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>;
  public abstract fNodeConnectionsIntersection: OutputEmitterRef<FNodeConnectionsIntersectionEvent>;

  public abstract fEmitOnNodeIntersect: boolean;

  public abstract fCreateNode: EventEmitter<FCreateNodeEvent>;

  public abstract fMoveNodes: EventEmitter<FMoveNodesEvent>;

  public abstract fReassignConnection: EventEmitter<FReassignConnectionEvent>;

  public abstract fCreateConnection: EventEmitter<FCreateConnectionEvent>;

  public abstract fConnectionWaypointsChanged: OutputEmitterRef<FConnectionWaypointsChangedEvent>;

  public abstract fDropToGroup: EventEmitter<FDropToGroupEvent>;

  public abstract vCellSize: InputSignalWithTransform<number, unknown>;

  public abstract hCellSize: InputSignalWithTransform<number, unknown>;

  public abstract fCellSizeWhileDragging: InputSignalWithTransform<boolean, unknown>;

  public abstract fDragStarted: EventEmitter<FDragStartedEvent>;

  public abstract fDragEnded: EventEmitter<void>;
}
