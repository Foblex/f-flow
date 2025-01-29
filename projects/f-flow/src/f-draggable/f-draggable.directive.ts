import {
  AfterViewInit, booleanAttribute, ContentChildren,
  Directive,
  ElementRef,
  EventEmitter, inject, Inject, Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit, Optional, Output, QueryList
} from "@angular/core";
import { FDraggableBase } from './f-draggable-base';
import {
  FDropToGroupEvent, NodeDragToParentFinalizeRequest,
  NodeDragToParentPreparationRequest,
  NodeMoveFinalizeRequest,
  NodeMovePreparationRequest
} from './node';
import { CanvasMoveFinalizeRequest, CanvasMovePreparationRequest } from './canvas';
import {
  FCreateConnectionEvent,
  FReassignConnectionEvent,
  ReassignConnectionPreparationRequest,
  ReassignConnectionFinalizeRequest,
  CreateConnectionPreparationRequest,
  CreateConnectionFinalizeRequest
} from './connections';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FMediator } from '@foblex/mediator';
import {
  AddDndToStoreRequest,
  EmitSelectionChangeEventRequest,
  PrepareDragSequenceRequest,
  RemoveDndFromStoreRequest,
  EndDragSequenceRequest,
  InitializeDragSequenceRequest,
  OnPointerMoveRequest, FEventTrigger, TriggerEvent, defaultEventTrigger
} from '../domain';
import {
  ExternalItemFinalizeRequest,
  ExternalItemPreparationRequest,
  FCreateNodeEvent,
  PreventDefaultIsExternalItemRequest
} from '../f-external-item';
import { SingleSelectRequest } from './single-select';
import { NodeResizeFinalizeRequest, NodeResizePreparationRequest } from './node-resize';
import { F_DRAG_AND_DROP_PLUGIN, IFDragAndDropPlugin } from './i-f-drag-and-drop-plugin';
import { BrowserService, EOperationSystem, PlatformService } from '@foblex/platform';
import { ICanRunOutsideAngular, IPointerEvent } from '@foblex/drag-toolkit';
import { FNodeIntersectedWithConnections } from './domain';
import { FInjector } from './f-injector';

@Directive({
  selector: "f-flow[fDraggable]",
  exportAs: 'fDraggable'
})
export class FDraggableDirective extends FDraggableBase implements OnInit, AfterViewInit, OnDestroy {

  private _elementReference = inject(ElementRef);

  private _fMediator = inject(FMediator);
  private _fPlatform = inject(PlatformService);
  private _injector = inject(Injector);

  @Input('fDraggableDisabled')
  public override disabled: boolean = false;

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @Input()
  public fMultiSelectTrigger: FEventTrigger = (event: TriggerEvent) => {
    return (this._fPlatform.getOS() === EOperationSystem.MAC_OS) ? event.metaKey : event.ctrlKey;
  };

  @Input()
  public fReassignConnectionTrigger: FEventTrigger = defaultEventTrigger;

  @Input()
  public fCreateConnectionTrigger: FEventTrigger = defaultEventTrigger;

  @Output()
  public override fSelectionChange = new EventEmitter<FSelectionChangeEvent>();

  @Output()
  public override fNodeIntersectedWithConnections = new EventEmitter<FNodeIntersectedWithConnections>();

  @Input({ transform: booleanAttribute })
  public override emitWhenNodeIntersectedWithConnection: boolean = false;

  @Output()
  public override fCreateNode = new EventEmitter<FCreateNodeEvent>();

  @Output()
  public override fReassignConnection = new EventEmitter<FReassignConnectionEvent>();

  @Output()
  public override fCreateConnection = new EventEmitter<FCreateConnectionEvent>();

  @Output()
  public override fDropToGroup = new EventEmitter<FDropToGroupEvent>();

  @Input()
  public override vCellSize = 1;

  @Input()
  public override hCellSize = 1;

  @Input()
  public override fCellSizeWhileDragging: boolean = false;

  @Output()
  public override fDragStarted = new EventEmitter<void>();

  @Output()
  public override fDragEnded = new EventEmitter<void>();

  @ContentChildren(F_DRAG_AND_DROP_PLUGIN, { descendants: true })
  private plugins!: QueryList<IFDragAndDropPlugin>;

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
    FInjector.set(this._injector);

    this._fMediator.execute<void>(new InitializeDragSequenceRequest());

    this.plugins.forEach((p) => p.onPointerDown?.(event));

    this._fMediator.execute<void>(new SingleSelectRequest(event, this.fMultiSelectTrigger));

    this._fMediator.execute<void>(new ReassignConnectionPreparationRequest(event, this.fReassignConnectionTrigger));

    this._fMediator.execute<void>(new CreateConnectionPreparationRequest(event, this.fCreateConnectionTrigger));

    const isMouseLeftOrTouch = event.isMouseLeftButton();
    if (!isMouseLeftOrTouch) {
      this.finalizeDragSequence();
    }
    return isMouseLeftOrTouch;
  }

  protected override prepareDragSequence(event: IPointerEvent) {

    this.plugins.forEach((p) => p.prepareDragSequence?.(event));

    this._fMediator.execute<void>(new NodeResizePreparationRequest(event));

    this._fMediator.execute<void>(new NodeMovePreparationRequest(event));

    this._fMediator.send<void>(new NodeDragToParentPreparationRequest(event));

    this._fMediator.execute<void>(new CanvasMovePreparationRequest(event));

    this._fMediator.send<void>(new ExternalItemPreparationRequest(event));

    this._fMediator.execute<void>(new PrepareDragSequenceRequest());
  }

  protected override onSelect(event: Event): void {
    this.plugins.forEach((x) => x.onSelect?.(event));

    this._fMediator.execute<void>(new PreventDefaultIsExternalItemRequest(event));
  }

  public override onPointerMove(event: IPointerEvent): void {
    this._fMediator.execute<void>(new OnPointerMoveRequest(event));
  }

  public override onPointerUp(event: IPointerEvent): void {
    this.plugins.forEach((x) => x.onPointerUp?.(event));

    this._fMediator.execute<void>(new ReassignConnectionFinalizeRequest(event));

    this._fMediator.execute<void>(new CreateConnectionFinalizeRequest(event));

    this._fMediator.execute<void>(new NodeResizeFinalizeRequest(event));

    this._fMediator.execute<void>(new NodeMoveFinalizeRequest(event));

    this._fMediator.execute<void>(new NodeDragToParentFinalizeRequest(event));

    this._fMediator.execute<void>(new CanvasMoveFinalizeRequest(event));

    this._fMediator.execute<void>(new ExternalItemFinalizeRequest(event));

    this._fMediator.execute<void>(new EndDragSequenceRequest());

    FInjector.clear();
  }

  protected override finalizeDragSequence(): void {
    this._fMediator.execute<void>(new EmitSelectionChangeEventRequest());

    FInjector.clear();
  }

  public ngOnDestroy(): void {
    this._fMediator.execute<void>(new RemoveDndFromStoreRequest());
    super.unsubscribe();

    FInjector.clear();
  }
}

