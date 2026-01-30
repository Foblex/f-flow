import {
  ElementRef,
  EventEmitter,
  inject,
  InputSignalWithTransform,
  OutputEmitterRef,
} from '@angular/core';
import { FCreateConnectionEvent, FReassignConnectionEvent } from './connection';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FCreateNodeEvent } from '../f-external-item';
import { FNodeIntersectedWithConnections } from './domain';
import { FDropToGroupEvent } from './f-drop-to-group';
import { DragAndDropBase } from '../drag-toolkit';
import { FMoveNodesEvent } from './f-node-move';
import { FConnectionWaypointsChangedEvent } from '../f-connection-v2';
import { FDragStartedEvent } from './domain/f-drag-started-event';

export abstract class FDraggableBase extends DragAndDropBase {
  public readonly hostElement = inject(ElementRef).nativeElement;

  public abstract fSelectionChange: EventEmitter<FSelectionChangeEvent>;

  public abstract fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>;

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
