import {
  AfterViewInit,
  booleanAttribute,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  NgZone,
  numberAttribute,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { FDraggableBase } from './f-draggable-base';
import {
  FMoveNodesEvent,
  FNodeMoveFinalizeRequest,
  FNodeMovePreparationRequest,
} from './f-node-move';
import { FCanvasMoveFinalizeRequest, FCanvasMovePreparationRequest } from './f-canvas';
import {
  FCreateConnectionEvent,
  FCreateConnectionFinalizeRequest,
  FCreateConnectionPreparationRequest,
  FReassignConnectionEvent,
  FReassignConnectionFinalizeRequest,
  FReassignConnectionPreparationRequest,
} from './f-connection';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FMediator } from '@foblex/mediator';
import {
  AddDndToStoreRequest,
  defaultEventTrigger,
  EmitSelectionChangeEventRequest,
  EndDragSequenceRequest,
  FEventTrigger,
  FTriggerEvent,
  InitializeDragSequenceRequest,
  OnPointerMoveRequest,
  PrepareDragSequenceRequest,
  RemoveDndFromStoreRequest,
} from '../domain';
import {
  FCreateNodeEvent,
  FExternalItemFinalizeRequest,
  FExternalItemPreparationRequest,
  PreventDefaultIsExternalItemRequest,
} from '../f-external-item';
import { FSingleSelectRequest } from './f-single-select';
import { NodeResizeFinalizeRequest, NodeResizePreparationRequest } from './f-node-resize';
import {
  F_AFTER_MAIN_PLUGIN,
  F_BEFORE_MAIN_PLUGIN,
  IFDragAndDropPlugin,
} from './i-f-drag-and-drop-plugin';
import { BrowserService, EOperationSystem, PlatformService } from '@foblex/platform';
import { FDragStartedEvent, FNodeIntersectedWithConnections } from './domain';
import { FDragHandlerResult } from './f-drag-handler';
import {
  FDropToGroupEvent,
  DropToGroupFinalizeRequest,
  DropToGroupPreparationRequest,
} from './f-drop-to-group';
import { FNodeRotateFinalizeRequest, FNodeRotatePreparationRequest } from './f-node-rotate';
import { IPointerEvent } from '../drag-toolkit';
import { isDragBlocker } from './is-drag-blocker';

// ┌──────────────────────────────┐
// │        Angular Realm         │
// │                              │
// │  ┌────────────────────────┐  │
// │  │  FDraggableDirective   │  │
// │  └──────────┬─────────────┘  │
// │             │ extends        │
// │  ┌──────────▼─────────────┐  │
// │  │     FDraggableBase     │  │
// │  └──────────┬─────────────┘  │
// │             │                │
// │             │ overrides      │
// │  ┌──────────▼─────────────┐  │
// │  │   DragAndDropBase      │  │
// │  └──────────┬─────────────┘  │
// │             │                │
// │      subscribes to           │
// │             │                │
// │        ┌────▼────┐           │
// │        │ Document│           │
// │        └─────────┘           │
// │                              │
// │  ┌────────────────────────┐  │
// │  │       FMediator        │◄─┬────┐
// │  └─────┬────────┬─────────┘  │    │
// │        │        │            │    │
// │   executes   executes        │    │
// │   F*Request   F*Event        │    │
// │        │        │            │    │
// └────────┴────────┴────────────┴────┘
//
//
// ┌──────────────────────────────────────┐
// │       Drag & Drop Runtime Layer      │
// │                                      │
// │  Events from DOM:                    │
// │    - mousedown / touchstart          │
// │    - mousemove / touchmove           │
// │    - pointerup                       │
// │                                      │
// │  ↓ Routed to                         │
// │                                      │
// │  ┌──────────────────────────────┐    │
// │  │     DragAndDropBase          │    │
// │  └──────────────────────────────┘    │
// │        ▲             ▲               │
// │        │             │               │
// │   checkDrag     onPointerMove        │
// │   Sequence      + Finalization       │
// │   To Start                           │
// └──────────────────────────────────────┘
@Directive({
  selector: 'f-flow[fDraggable]',
  exportAs: 'fDraggable',
  providers: [FDragHandlerResult],
})
export class FDraggableDirective
  extends FDraggableBase
  implements OnInit, AfterViewInit, OnDestroy
{
  public readonly hostElement = inject(ElementRef).nativeElement;

  private readonly _result = inject(FDragHandlerResult);
  private readonly _mediator = inject(FMediator);
  private readonly _platform = inject(PlatformService);
  private readonly _browser = inject(BrowserService);

  @Input({ transform: booleanAttribute, alias: 'fDraggableDisabled' })
  public override disabled: boolean = false;

  @Input()
  public fMultiSelectTrigger: FEventTrigger = (event: FTriggerEvent) => {
    return this._platform.getOS() === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  };

  @Input()
  public fReassignConnectionTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fCreateConnectionTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fNodeResizeTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fNodeRotateTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fNodeMoveTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fCanvasMoveTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fExternalItemTrigger: FEventTrigger = defaultEventTrigger;

  @Output()
  public override fSelectionChange = new EventEmitter<FSelectionChangeEvent>();

  @Output()
  public override fNodeIntersectedWithConnections =
    new EventEmitter<FNodeIntersectedWithConnections>();

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

  @ContentChildren(F_BEFORE_MAIN_PLUGIN, { descendants: true })
  private _beforePlugins!: QueryList<IFDragAndDropPlugin>;

  @ContentChildren(F_AFTER_MAIN_PLUGIN, { descendants: true })
  private _afterPlugins!: QueryList<IFDragAndDropPlugin>;

  constructor() {
    super(inject(NgZone, { optional: true }));
  }

  public ngOnInit(): void {
    this._mediator.execute<void>(new AddDndToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    super.subscribe(this._browser.document);
  }

  public override onPointerDown(event: IPointerEvent): boolean {
    if (isDragBlocker(event.targetElement)) {
      return false;
    }

    this._result.clear();

    this._mediator.execute<void>(new InitializeDragSequenceRequest());

    this._beforePlugins.forEach((p) => p.onPointerDown?.(event));

    this._mediator.execute<void>(new FSingleSelectRequest(event, this.fMultiSelectTrigger));

    this._mediator.execute<void>(
      new FReassignConnectionPreparationRequest(event, this.fReassignConnectionTrigger),
    );

    this._mediator.execute<void>(
      new FCreateConnectionPreparationRequest(event, this.fCreateConnectionTrigger),
    );

    this._afterPlugins.forEach((p) => p.onPointerDown?.(event));

    const isMouseLeftOrTouch = event.isMouseLeftButton();
    if (!isMouseLeftOrTouch) {
      this.finalizeDragSequence();
    }

    return isMouseLeftOrTouch;
  }

  protected override prepareDragSequence(event: IPointerEvent) {
    this._beforePlugins.forEach((p) => p.prepareDragSequence?.(event));

    this._mediator.execute<void>(new NodeResizePreparationRequest(event, this.fNodeResizeTrigger));

    this._mediator.execute<void>(new FNodeRotatePreparationRequest(event, this.fNodeRotateTrigger));

    this._mediator.execute<void>(new FNodeMovePreparationRequest(event, this.fNodeMoveTrigger));

    this._mediator.execute<void>(
      new FExternalItemPreparationRequest(event, this.fExternalItemTrigger),
    );

    this._mediator.execute<void>(new DropToGroupPreparationRequest(event));

    this._mediator.execute<void>(new FCanvasMovePreparationRequest(event, this.fCanvasMoveTrigger));

    this._afterPlugins.forEach((p) => p.prepareDragSequence?.(event));

    this._mediator.execute<void>(new PrepareDragSequenceRequest());
  }

  protected override onSelect(event: Event): void {
    this._mediator.execute<void>(new PreventDefaultIsExternalItemRequest(event));
  }

  public override onPointerMove(event: IPointerEvent): void {
    this._mediator.execute<void>(new OnPointerMoveRequest(event));
  }

  public override onPointerUp(event: IPointerEvent): void {
    this._beforePlugins.forEach((x) => x.onPointerUp?.(event));

    this._mediator.execute<void>(new FReassignConnectionFinalizeRequest(event));

    this._mediator.execute<void>(new FCreateConnectionFinalizeRequest(event));

    this._mediator.execute<void>(new NodeResizeFinalizeRequest(event));

    this._mediator.execute<void>(new FNodeRotateFinalizeRequest(event));

    this._mediator.execute<void>(new FNodeMoveFinalizeRequest(event));

    this._mediator.execute<void>(new FExternalItemFinalizeRequest(event));

    this._mediator.execute<void>(new DropToGroupFinalizeRequest(event));

    this._mediator.execute<void>(new FCanvasMoveFinalizeRequest(event));

    this._afterPlugins.forEach((x) => x.onPointerUp?.(event));

    this._mediator.execute<void>(new EndDragSequenceRequest());
  }

  protected override finalizeDragSequence(): void {
    this._mediator.execute<void>(new EmitSelectionChangeEventRequest());

    this._result.clear();
  }

  public ngOnDestroy(): void {
    this._mediator.execute<void>(new RemoveDndFromStoreRequest());
    super.unsubscribe();
  }
}
