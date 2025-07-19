import {
  AfterViewInit, booleanAttribute, ContentChildren,
  Directive,
  ElementRef,
  EventEmitter, inject, Inject,
  Input,
  NgZone, numberAttribute,
  OnDestroy,
  OnInit, Optional, Output, QueryList
} from "@angular/core";
import {FDraggableBase} from './f-draggable-base';
import {
  FMoveNodesEvent,
  FNodeMoveFinalizeRequest,
  FNodeMovePreparationRequest
} from './f-node-move';
import {FCanvasMoveFinalizeRequest, FCanvasMovePreparationRequest} from './f-canvas';
import {
  FCreateConnectionEvent,
  FReassignConnectionEvent,
  FReassignConnectionPreparationRequest,
  FReassignConnectionFinalizeRequest,
  FCreateConnectionPreparationRequest,
  FCreateConnectionFinalizeRequest
} from './f-connection';
import {FSelectionChangeEvent} from './f-selection-change-event';
import {FMediator} from '@foblex/mediator';
import {
  AddDndToStoreRequest,
  EmitSelectionChangeEventRequest,
  PrepareDragSequenceRequest,
  RemoveDndFromStoreRequest,
  EndDragSequenceRequest,
  InitializeDragSequenceRequest,
  OnPointerMoveRequest, FEventTrigger, FTriggerEvent, defaultEventTrigger
} from '../domain';
import {
  FExternalItemFinalizeRequest,
  FExternalItemPreparationRequest,
  FCreateNodeEvent,
  PreventDefaultIsExternalItemRequest
} from '../f-external-item';
import {FSingleSelectRequest} from './f-single-select';
import {FNodeResizeFinalizeRequest, FNodeResizePreparationRequest} from './f-node-resize';
import {F_AFTER_MAIN_PLUGIN, F_BEFORE_MAIN_PLUGIN, IFDragAndDropPlugin} from './i-f-drag-and-drop-plugin';
import {BrowserService, EOperationSystem, PlatformService} from '@foblex/platform';
import {FDragStartedEvent, FNodeIntersectedWithConnections} from './domain';
import {FDragHandlerResult} from './f-drag-handler';
import {
  FDropToGroupEvent,
  FNodeDropToGroupFinalizeRequest,
  FNodeDropToGroupPreparationRequest
} from './f-drop-to-group';
import {FNodeRotateFinalizeRequest, FNodeRotatePreparationRequest} from './f-node-rotate';
import {ICanRunOutsideAngular, IPointerEvent} from "../drag-toolkit";
import {isDragBlocker} from "./is-drag-blocker";
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
  selector: "f-flow[fDraggable]",
  exportAs: 'fDraggable',
  providers: [FDragHandlerResult]
})
export class FDraggableDirective extends FDraggableBase implements OnInit, AfterViewInit, OnDestroy {

  private _elementReference = inject(ElementRef);

  private _fResult = inject(FDragHandlerResult);
  private _fMediator = inject(FMediator);
  private _fPlatform = inject(PlatformService);

  @Input({transform: booleanAttribute, alias: 'fDraggableDisabled'})
  public override disabled: boolean = false;

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @Input()
  public fMultiSelectTrigger: FEventTrigger = (event: FTriggerEvent) => {
    return (this._fPlatform.getOS() === EOperationSystem.MAC_OS) ? event.metaKey : event.ctrlKey;
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
  public override fNodeIntersectedWithConnections = new EventEmitter<FNodeIntersectedWithConnections>();

  @Input({transform: booleanAttribute})
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

  @Input({transform: numberAttribute})
  public override vCellSize = 1;

  @Input({transform: numberAttribute})
  public override hCellSize = 1;

  @Input({transform: booleanAttribute})
  public override fCellSizeWhileDragging: boolean = false;

  @Output()
  public override fDragStarted = new EventEmitter<FDragStartedEvent>();

  @Output()
  public override fDragEnded = new EventEmitter<void>();

  @ContentChildren(F_BEFORE_MAIN_PLUGIN, {descendants: true})
  private _beforePlugins!: QueryList<IFDragAndDropPlugin>;

  @ContentChildren(F_AFTER_MAIN_PLUGIN, {descendants: true})
  private _afterPlugins!: QueryList<IFDragAndDropPlugin>;

  constructor(
    @Inject(NgZone) @Optional() ngZone: ICanRunOutsideAngular,
    private _fBrowser: BrowserService,
  ) {
    super(ngZone);
  }

  public ngOnInit(): void {
    this._fMediator.execute<void>(new AddDndToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    super.subscribe(this._fBrowser.document);
  }

  public override onPointerDown(event: IPointerEvent): boolean {
    if (isDragBlocker(event.targetElement)) {
      return false;
    }

    this._fResult.clear();

    this._fMediator.execute<void>(new InitializeDragSequenceRequest());

    this._beforePlugins.forEach((p) => p.onPointerDown?.(event));

    this._fMediator.execute<void>(new FSingleSelectRequest(event, this.fMultiSelectTrigger));

    this._fMediator.execute<void>(new FReassignConnectionPreparationRequest(event, this.fReassignConnectionTrigger));

    this._fMediator.execute<void>(new FCreateConnectionPreparationRequest(event, this.fCreateConnectionTrigger));

    this._afterPlugins.forEach((p) => p.onPointerDown?.(event));

    const isMouseLeftOrTouch = event.isMouseLeftButton();
    if (!isMouseLeftOrTouch) {
      this.finalizeDragSequence();
    }
    return isMouseLeftOrTouch;
  }

  protected override prepareDragSequence(event: IPointerEvent) {

    this._beforePlugins.forEach((p) => p.prepareDragSequence?.(event));

    this._fMediator.execute<void>(new FNodeResizePreparationRequest(event, this.fNodeResizeTrigger));

    this._fMediator.execute<void>(new FNodeRotatePreparationRequest(event, this.fNodeRotateTrigger));

    this._fMediator.execute<void>(new FNodeMovePreparationRequest(event, this.fNodeMoveTrigger));

    this._fMediator.execute<void>(new FExternalItemPreparationRequest(event, this.fExternalItemTrigger));

    this._fMediator.execute<void>(new FNodeDropToGroupPreparationRequest(event));

    this._fMediator.execute<void>(new FCanvasMovePreparationRequest(event, this.fCanvasMoveTrigger));

    this._afterPlugins.forEach((p) => p.prepareDragSequence?.(event));

    this._fMediator.execute<void>(new PrepareDragSequenceRequest());
  }

  protected override onSelect(event: Event): void {
    this._fMediator.execute<void>(new PreventDefaultIsExternalItemRequest(event));
  }

  public override onPointerMove(event: IPointerEvent): void {
    this._fMediator.execute<void>(new OnPointerMoveRequest(event));
  }

  public override onPointerUp(event: IPointerEvent): void {
    this._beforePlugins.forEach((x) => x.onPointerUp?.(event));

    this._fMediator.execute<void>(new FReassignConnectionFinalizeRequest(event));

    this._fMediator.execute<void>(new FCreateConnectionFinalizeRequest(event));

    this._fMediator.execute<void>(new FNodeResizeFinalizeRequest(event));

    this._fMediator.execute<void>(new FNodeRotateFinalizeRequest(event));

    this._fMediator.execute<void>(new FNodeMoveFinalizeRequest(event));

    this._fMediator.execute<void>(new FExternalItemFinalizeRequest(event));

    this._fMediator.execute<void>(new FNodeDropToGroupFinalizeRequest(event));

    this._fMediator.execute<void>(new FCanvasMoveFinalizeRequest(event));

    this._afterPlugins.forEach((x) => x.onPointerUp?.(event));

    this._fMediator.execute<void>(new EndDragSequenceRequest());
  }

  protected override finalizeDragSequence(): void {
    this._fMediator.execute<void>(new EmitSelectionChangeEventRequest());

    this._fResult.clear();
  }

  public ngOnDestroy(): void {
    this._fMediator.execute<void>(new RemoveDndFromStoreRequest());
    super.unsubscribe();
  }
}

