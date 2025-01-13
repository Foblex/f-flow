import {
  AfterViewInit, ContentChildren,
  Directive,
  ElementRef,
  EventEmitter, inject, Inject,
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
  OnPointerMoveRequest
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
import { BrowserService } from '@foblex/platform';
import { ICanRunOutsideAngular, IPointerEvent } from '@foblex/drag-toolkit';
import { FNodeIntersectedWithConnections } from './domain';

@Directive({
  selector: "f-flow[fDraggable]",
  exportAs: 'fDraggable'
})
export class FDraggableDirective extends FDraggableBase implements OnInit, AfterViewInit, OnDestroy {

  private _elementReference = inject(ElementRef);

  private _fMediator = inject(FMediator);

  @Input('fDraggableDisabled')
  public override disabled: boolean = false;

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @Output()
  public override fSelectionChange = new EventEmitter<FSelectionChangeEvent>();

  @Output()
  public override fNodeIntersectedWithConnections = new EventEmitter<FNodeIntersectedWithConnections>();

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

  @ContentChildren(F_DRAG_AND_DROP_PLUGIN, { descendants: true })
  private plugins!: QueryList<IFDragAndDropPlugin>;

  constructor(
    @Inject(NgZone) @Optional() ngZone: ICanRunOutsideAngular,
    private _fBrowser: BrowserService,
  ) {
    super(ngZone);
  }

  public ngOnInit(): void {
    this._fMediator.send<void>(new AddDndToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    super.subscribe(this._fBrowser.document);
  }

  public override onPointerDown(event: IPointerEvent): boolean {

    this._fMediator.send<void>(new InitializeDragSequenceRequest());

    this.plugins.forEach((p) => p.onPointerDown?.(event));

    this._fMediator.send<void>(new SingleSelectRequest(event));

    this._fMediator.send<void>(new ReassignConnectionPreparationRequest(event));

    this._fMediator.send<void>(new CreateConnectionPreparationRequest(event));

    const isMouseLeftButton = event.isMouseLeftButton();
    if (!isMouseLeftButton) {
      this.finalizeDragSequence();
    }
    return isMouseLeftButton;
  }

  protected override prepareDragSequence(event: IPointerEvent) {

    this.plugins.forEach((p) => p.prepareDragSequence?.(event));

    this._fMediator.send<void>(new NodeResizePreparationRequest(event));

    this._fMediator.send<void>(new NodeMovePreparationRequest(event));

    this._fMediator.send<void>(new NodeDragToParentPreparationRequest(event));

    this._fMediator.send<void>(new CanvasMovePreparationRequest(event));

    this._fMediator.send<void>(new ExternalItemPreparationRequest(event));


    this._fMediator.send<void>(new PrepareDragSequenceRequest());
  }

  protected override onSelect(event: Event): void {
    this.plugins.forEach((x) => x.onSelect?.(event));

    this._fMediator.send<void>(new PreventDefaultIsExternalItemRequest(event));
  }

  public override onPointerMove(event: IPointerEvent): void {
    this._fMediator.send<void>(new OnPointerMoveRequest(event));
  }

  public override onPointerUp(event: IPointerEvent): void {

    this.plugins.forEach((x) => x.onPointerUp?.(event));

    this._fMediator.send<void>(new ReassignConnectionFinalizeRequest(event));

    this._fMediator.send<void>(new CreateConnectionFinalizeRequest(event));

    this._fMediator.send<void>(new NodeResizeFinalizeRequest(event));

    this._fMediator.send<void>(new NodeMoveFinalizeRequest(event));

    this._fMediator.send<void>(new NodeDragToParentFinalizeRequest(event));

    this._fMediator.send<void>(new CanvasMoveFinalizeRequest(event));

    this._fMediator.send<void>(new ExternalItemFinalizeRequest(event));

    this._fMediator.send<void>(new EndDragSequenceRequest());
  }

  protected override finalizeDragSequence(): void {
    this._fMediator.send<void>(new EmitSelectionChangeEventRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.send<void>(new RemoveDndFromStoreRequest());
    super.unsubscribe();
  }
}

