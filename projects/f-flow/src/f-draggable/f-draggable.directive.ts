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
  StartDragSequenceRequest,
  RemoveDndFromStoreRequest,
  EndDragSequenceRequest,
  InitializeDragSequenceRequest,
  HandleDragSequenceRequest
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
  public override fSelectionChange: EventEmitter<FSelectionChangeEvent> = new EventEmitter<FSelectionChangeEvent>();

  // @Output()
  // public override fConnectionIntersectNode: EventEmitter<ConnectionIntersectNodeEvent> = new EventEmitter<ConnectionIntersectNodeEvent>();

  @Output()
  public override fCreateNode: EventEmitter<FCreateNodeEvent> = new EventEmitter<FCreateNodeEvent>();

  @Output()
  public override fReassignConnection: EventEmitter<FReassignConnectionEvent> = new EventEmitter<FReassignConnectionEvent>();

  @Output()
  public override fCreateConnection: EventEmitter<FCreateConnectionEvent> = new EventEmitter<FCreateConnectionEvent>();

  @Output()
  public override fDropToGroup: EventEmitter<FDropToGroupEvent> = new EventEmitter<FDropToGroupEvent>();

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

    let result: boolean = event.isMouseLeftButton();

    this.plugins.forEach((p) => {
      p.onPointerDown?.(event);
    });

    this._fMediator.send<void>(new SingleSelectRequest(event));

    this._fMediator.send<void>(new ReassignConnectionPreparationRequest(event));

    this._fMediator.send<void>(new CreateConnectionPreparationRequest(event));

    if (!result) {
      this.finalizeDragSequence();
    }
    return result;
  }

  protected override prepareDragSequence(event: IPointerEvent) {

    this.plugins.forEach((p) => {
      p.prepareDragSequence?.(event);
    });

    this._fMediator.send<void>(new NodeResizePreparationRequest(event));

    this._fMediator.send<void>(new NodeMovePreparationRequest(event));

    this._fMediator.send<void>(new NodeDragToParentPreparationRequest(event));

    this._fMediator.send<void>(new CanvasMovePreparationRequest(event));

    this._fMediator.send<void>(new ExternalItemPreparationRequest(event));


    this._fMediator.send<void>(new StartDragSequenceRequest());
  }

  protected override onSelect(event: Event): void {
    this.plugins.forEach((p) => {
      p.onSelect?.(event);
    });

    this._fMediator.send<void>(new PreventDefaultIsExternalItemRequest(event));
  }

  public override onPointerMove(event: IPointerEvent): void {
    this._fMediator.send<void>(new HandleDragSequenceRequest(event));
  }

  public override onPointerUp(event: IPointerEvent): void {

    this.plugins.forEach((p) => {
      p.onPointerUp?.(event);
    });

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

