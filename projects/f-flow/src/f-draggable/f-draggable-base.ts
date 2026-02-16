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
import { FCreateNodeEvent } from '../f-external-item';
import { FDropToGroupEvent } from './drop-to-group';
import { DragAndDropBase } from '../drag-toolkit';
import { FMoveNodesEvent } from './drag-node';
import { FDragStartedEvent } from './f-drag-started-event';
import { FNodeConnectionsIntersectionEvent, FNodeIntersectedWithConnections } from './domain';

export abstract class FDraggableBase extends DragAndDropBase {
  public readonly hostElement = inject(ElementRef).nativeElement;

  public abstract fSelectionChange: EventEmitter<FSelectionChangeEvent>;

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
