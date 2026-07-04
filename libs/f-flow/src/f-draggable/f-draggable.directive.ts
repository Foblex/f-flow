import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  EventEmitter,
  inject,
  Injector,
  input,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { FDraggableBase } from './f-draggable-base';
import { DragNodeFinalizeRequest, DragNodePreparationRequest, FMoveNodesEvent } from './drag-node';
import { DragCanvasFinalizeRequest, DragCanvasPreparationRequest } from './drag-canvas';
import {
  CreateConnectionFinalizeRequest,
  CreateConnectionPreparationRequest,
  DragConnectionWaypointFinalizeRequest,
  DragConnectionWaypointPreparationRequest,
  FConnectionWaypointsChangedEvent,
  FCreateConnectionEvent,
  FReassignConnectionEvent,
  ReassignConnectionFinalizeRequest,
  ReassignConnectionPreparationRequest,
} from './connection';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FMediator } from '@foblex/mediator';
import {
  AddDndToStoreRequest,
  defaultEventTrigger,
  FEventTrigger,
  FTriggerEvent,
  InitializeDragSequenceRequest,
  OnPointerMoveRequest,
  PrepareDragSequenceRequest,
  RemoveDndFromStoreRequest,
} from '../domain';
import {
  F_DEFAULT_CONTROL_SCHEME,
  FControlSchemeController,
  IFControlScheme,
} from '../plugins/interaction/f-control-scheme';
import { F_CONNECTION_FLOW, IFConnectionFlow } from '../plugins/interaction/f-connection-flow';
import { ScheduleAutoPanFrameRequest, StopAutoPanRequest } from './auto-pan';
import { SelectByPointerRequest } from './select-by-pointer';
import { ResizeNodeFinalizeRequest, ResizeNodePreparationRequest } from './resize-node';
import { EOperationSystem, PlatformService } from '@foblex/platform';
import {
  EmitEndDragSequenceEventRequest,
  EmitSelectionChangeEventRequest,
  FNodeConnectionsIntersectionEvent,
  FNodeIntersectedWithConnections,
} from './domain';
import { DragHandlerInjector, FDragHandlerResult } from './infrastructure';
import {
  DropToGroupFinalizeRequest,
  DropToGroupPreparationRequest,
  FDropToGroupEvent,
} from './drop-to-group';
import { RotateNodeFinalizeRequest, RotateNodePreparationRequest } from './rotate-node';
import { IPointerEvent } from './infrastructure';
import { isDragBlocker } from './is-drag-blocker';
import { PinchToZoomFinalizeRequest, PinchToZoomPreparationRequest } from './pinch-to-zoom';
import { FDragStartedEvent } from './f-drag-started-event';
import { SelectionAreaFinalizeRequest, SelectionAreaPreparationRequest } from './selection-area';
import {
  DragExternalItemFinalizeRequest,
  DragExternalItemPreparationRequest,
  FCreateNodeEvent,
  PreventDefaultIsExternalItemRequest,
} from './drag-external-item';
import { DragMinimapFinalizeRequest, DragMinimapPreparationRequest } from './drag-minimap';

@Directive({
  standalone: false,
  selector: 'f-flow[fDraggable]',
  exportAs: 'fDraggable',
  providers: [FDragHandlerResult, DragHandlerInjector],
})
export class FDraggableDirective
  extends FDraggableBase
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly _result = inject(FDragHandlerResult);
  private readonly _mediator = inject(FMediator);
  private readonly _platform = inject(PlatformService);
  private readonly _controlScheme = inject(FControlSchemeController, { optional: true });
  private readonly _connectionFlowType = inject(F_CONNECTION_FLOW, { optional: true });
  private readonly _injector = inject(Injector);
  private _connectionFlow: IFConnectionFlow | null = null;

  // Raw values of the scheme-driven trigger inputs. Each public property below stays an
  // always-callable `FEventTrigger`: the setter stores the bound value and the getter
  // falls back to the active control scheme's gesture — see `withControlScheme(...)`.
  private _reassignConnectionTrigger: FEventTrigger | undefined;
  private _createConnectionTrigger: FEventTrigger | undefined;
  private _nodeResizeTrigger: FEventTrigger | undefined;
  private _nodeRotateTrigger: FEventTrigger | undefined;
  private _nodeMoveTrigger: FEventTrigger | undefined;
  private _canvasMoveTrigger: FEventTrigger | undefined;

  @Input({ transform: booleanAttribute, alias: 'fDraggableDisabled' })
  public override disabled: boolean = false;

  @Input()
  public fMultiSelectTrigger: FEventTrigger = (event: FTriggerEvent) => {
    return this._platform.getOS() === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  };

  @Input()
  public set fReassignConnectionTrigger(value: FEventTrigger) {
    this._reassignConnectionTrigger = value;
  }

  public get fReassignConnectionTrigger(): FEventTrigger {
    return this._reassignConnectionTrigger ?? this._scheme.reassignConnection;
  }

  @Input()
  public set fCreateConnectionTrigger(value: FEventTrigger) {
    this._createConnectionTrigger = value;
  }

  public get fCreateConnectionTrigger(): FEventTrigger {
    return this._createConnectionTrigger ?? this._scheme.createConnection;
  }

  public fConnectionWaypointsTrigger = input<FEventTrigger>(defaultEventTrigger);

  @Input()
  public fMoveControlPointTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public set fNodeResizeTrigger(value: FEventTrigger) {
    this._nodeResizeTrigger = value;
  }

  public get fNodeResizeTrigger(): FEventTrigger {
    return this._nodeResizeTrigger ?? this._scheme.nodeResize;
  }

  @Input()
  public set fNodeRotateTrigger(value: FEventTrigger) {
    this._nodeRotateTrigger = value;
  }

  public get fNodeRotateTrigger(): FEventTrigger {
    return this._nodeRotateTrigger ?? this._scheme.nodeRotate;
  }

  @Input()
  public set fNodeMoveTrigger(value: FEventTrigger) {
    this._nodeMoveTrigger = value;
  }

  public get fNodeMoveTrigger(): FEventTrigger {
    return this._nodeMoveTrigger ?? this._scheme.nodeMove;
  }

  @Input()
  public set fCanvasMoveTrigger(value: FEventTrigger) {
    this._canvasMoveTrigger = value;
  }

  public get fCanvasMoveTrigger(): FEventTrigger {
    return this._canvasMoveTrigger ?? this._scheme.canvasMove;
  }

  @Input()
  public fExternalItemTrigger: FEventTrigger = defaultEventTrigger;

  /** Active control scheme (provider-driven, defaults to `F_DEFAULT_CONTROL_SCHEME`). */
  private get _scheme(): IFControlScheme {
    return this._controlScheme?.scheme() ?? F_DEFAULT_CONTROL_SCHEME;
  }

  @Output()
  public override fSelectionChange = new EventEmitter<FSelectionChangeEvent>();

  /** @deprecated Use `fNodeConnectionsIntersection` */
  @Output()
  public override fNodeIntersectedWithConnections =
    new EventEmitter<FNodeIntersectedWithConnections>();
  public readonly fNodeConnectionsIntersection = output<FNodeConnectionsIntersectionEvent>();

  @Input({ transform: booleanAttribute })
  public override fEmitOnNodeIntersect: boolean = false;

  @Output()
  public override fCreateNode = new EventEmitter<FCreateNodeEvent>();

  @Output()
  public override fMoveNodes = new EventEmitter<FMoveNodesEvent>();

  @Output()
  public override fReassignConnection = new EventEmitter<FReassignConnectionEvent>();

  @Output()
  public override fCreateConnection = new EventEmitter<FCreateConnectionEvent>();

  public override fConnectionWaypointsChanged = output<FConnectionWaypointsChangedEvent>();

  @Output()
  public override fDropToGroup = new EventEmitter<FDropToGroupEvent>();

  /**
   * Defines the vertical cell size for the grid.
   * This value is used to snap nodes to a vertical grid while dragging.
   * The default value is `1`, which means that nodes will snap to every pixel vertically.
   */
  public override vCellSize = input(1, {
    transform: (value: unknown) => numberAttribute(value, 1),
  });

  /**
   * Defines the horizontal cell size for the grid.
   * This value is used to snap nodes to a horizontal grid while dragging.
   * The default value is `1`, which means that nodes will snap to every pixel horizontally.
   */
  public override hCellSize = input(1, {
    transform: (value: unknown) => numberAttribute(value, 1),
  });

  /**
   * Defines whether the cell size should be applied while dragging.
   * If set to `true`, the dragged nodes will snap to the grid defined by `vCellSize` and `hCellSize`.
   * If set to `false`, the nodes will move freely without snapping to the grid.
   */
  public override fCellSizeWhileDragging = input(false, {
    transform: (value: unknown) => booleanAttribute(value),
  });

  @Output()
  public override fDragStarted = new EventEmitter<FDragStartedEvent>();

  @Output()
  public override fDragEnded = new EventEmitter<void>();

  private readonly _dragHandlerInjector = inject(DragHandlerInjector);

  public ngOnInit(): void {
    this._mediator.execute<void>(new AddDndToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    super.subscribe();

    // The strategy type comes from the consumer's providers, but its dependencies live
    // at the f-flow injector — instantiate it here so both are visible.
    if (this._connectionFlowType) {
      this._connectionFlow = Injector.create({
        providers: [this._connectionFlowType],
        parent: this._injector,
      }).get(this._connectionFlowType);
      this._connectionFlow.initialize();
    }
  }

  public override onPointerDown(event: IPointerEvent): boolean {
    if (isDragBlocker(event.targetElement)) {
      return false;
    }
    this._dragHandlerInjector.create();

    this._result.clear();

    this._mediator.execute<void>(new InitializeDragSequenceRequest());

    this._mediator.execute<void>(new SelectionAreaPreparationRequest(event));

    this._mediator.execute<void>(new DragMinimapPreparationRequest(event));

    this._mediator.execute<void>(new PinchToZoomPreparationRequest(event));

    this._mediator.execute<void>(new SelectByPointerRequest(event, this.fMultiSelectTrigger));

    this._mediator.execute<void>(
      new ReassignConnectionPreparationRequest(event, this.fReassignConnectionTrigger),
    );

    this._mediator.execute<void>(
      new CreateConnectionPreparationRequest(event, this.fCreateConnectionTrigger),
    );

    this._mediator.execute<void>(
      new DragConnectionWaypointPreparationRequest(event, this.fConnectionWaypointsTrigger()),
    );

    // The left button and touch drive every interaction. The middle button joins only
    // when the active scheme's `canvasMove` gesture claims it (e.g. middle-drag pan in
    // the scroll-pan / drag-select schemes); with the default scheme it stays inert.
    const isDraggableButton =
      event.isMouseLeftButton() ||
      (event.isMouseMiddleButton() && this._scheme.canvasMove(event.originalEvent));
    if (!isDraggableButton) {
      this.finalizeDragSequence();
    }

    return isDraggableButton;
  }

  protected override prepareDragSequence(event: IPointerEvent) {
    this._mediator.execute<void>(new ResizeNodePreparationRequest(event, this.fNodeResizeTrigger));

    this._mediator.execute<void>(new RotateNodePreparationRequest(event, this.fNodeRotateTrigger));

    this._mediator.execute<void>(new DragNodePreparationRequest(event, this.fNodeMoveTrigger));

    this._mediator.execute<void>(
      new DragExternalItemPreparationRequest(event, this.fExternalItemTrigger),
    );

    this._mediator.execute<void>(new DropToGroupPreparationRequest(event));

    this._mediator.execute<void>(new DragCanvasPreparationRequest(event, this.fCanvasMoveTrigger));

    this._mediator.execute<void>(new PrepareDragSequenceRequest());
  }

  protected override onSelect(event: Event): void {
    this._mediator.execute<void>(new PreventDefaultIsExternalItemRequest(event));
  }

  public override onPointerMove(event: IPointerEvent): void {
    this._mediator.execute<void>(new OnPointerMoveRequest(event));
    this._mediator.execute<void>(new ScheduleAutoPanFrameRequest());
  }

  public override onPointerUp(event: IPointerEvent): void {
    this._mediator.execute<void>(new DragMinimapFinalizeRequest(event));

    this._mediator.execute<void>(new SelectionAreaFinalizeRequest(event));

    this._mediator.execute<void>(new ReassignConnectionFinalizeRequest(event));

    this._mediator.execute<void>(new CreateConnectionFinalizeRequest(event));

    this._mediator.execute<void>(new ResizeNodeFinalizeRequest(event));

    this._mediator.execute<void>(new RotateNodeFinalizeRequest(event));

    this._mediator.execute<void>(new DragNodeFinalizeRequest(event));

    this._mediator.execute<void>(new DragExternalItemFinalizeRequest(event));

    this._mediator.execute<void>(new DropToGroupFinalizeRequest(event));

    this._mediator.execute<void>(new DragCanvasFinalizeRequest(event));

    this._mediator.execute<void>(new PinchToZoomFinalizeRequest(event));

    this._mediator.execute<void>(new DragConnectionWaypointFinalizeRequest(event));

    this._mediator.execute<void>(new EmitEndDragSequenceEventRequest());
  }

  protected override finalizeDragSequence(): void {
    this._mediator.execute<void>(new StopAutoPanRequest());
    this._mediator.execute<void>(new EmitSelectionChangeEventRequest());

    this._result.clear();

    this._dragHandlerInjector.destroy();
  }

  public ngOnDestroy(): void {
    this._connectionFlow?.destroy();
    this._mediator.execute<void>(new StopAutoPanRequest());
    this._mediator.execute<void>(new RemoveDndFromStoreRequest());
    super.unsubscribe();
  }
}
