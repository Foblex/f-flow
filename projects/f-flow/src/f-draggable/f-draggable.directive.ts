import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter, Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit, Output
} from "@angular/core";
import { F_DRAGGABLE, FDraggableBase } from './f-draggable-base';
import { FComponentsStore } from '../f-storage';
import { FDraggableDataContext } from './f-draggable-data-context';
import { Subscription } from 'rxjs';
import { FCreateNodeEvent, ExternalItemPreparationRequest, ExternalItemFinalizeRequest } from './external-item';
import { IPointerEvent, Point } from '@foblex/core';
import { NodeMoveFinalizeRequest, NodeMovePreparationRequest } from './node';
import { CanvasMoveFinalizeRequest, CanvasMovePreparationRequest } from './canvas';
import { DOCUMENT } from '@angular/common';
import {
  FCreateConnectionEvent,
  FReassignConnectionEvent,
  ReassignConnectionPreparationRequest,
  ReassignConnectionFinalizeRequest,
  CreateConnectionPreparationRequest,
  CreateConnectionFinalizeRequest
} from './connections';
import { FSelectionChangeEvent } from './f-selection-change-event';
import { FFlowMediator } from '../infrastructure';
import { GetSelectionRequest } from '../domain';
import { isExternalItem } from '../f-external-item';
import { SingleSelectRequest } from './single-select';
import { NodeResizeFinalizeRequest, NodeResizePreparationRequest } from './node-resize';
import { SelectionAreaFinalizeRequest, SelectionAreaPreparationRequest } from './selection-area';

@Directive({
  selector: "f-flow[fDraggable]",
  exportAs: 'fDraggable',
  providers: [
    { provide: F_DRAGGABLE, useExisting: FDraggableDirective }
  ]
})
export class FDraggableDirective extends FDraggableBase implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  @Input('fDraggableDisabled')
  public override disabled: boolean = false;

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
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

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fDraggableDataContext: FDraggableDataContext,
    ngZone: NgZone,
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
    @Inject(DOCUMENT) private doc: Document
  ) {
    super(ngZone);
  }

  public ngOnInit(): void {
    this.fComponentsStore.fDraggable = this;
  }

  public ngAfterViewInit(): void {
    super.subscribe(this.doc);
  }

  public override onPointerDown(event: IPointerEvent): boolean {
    this.fDraggableDataContext.reset();
    let result: boolean = event.isMouseLeftButton();

    this.fMediator.send<void>(new SingleSelectRequest(event));

    this.fMediator.send<void>(new ReassignConnectionPreparationRequest(event));

    this.fMediator.send<void>(new CreateConnectionPreparationRequest(event));

    if (!result) {
      this.finalizeDragSequence();
    }

    return result;
  }

  protected override prepareDragSequence(event: IPointerEvent) {
    this.fMediator.send<void>(new SelectionAreaPreparationRequest(event));

    this.fMediator.send<void>(new NodeResizePreparationRequest(event));

    this.fMediator.send<void>(new NodeMovePreparationRequest(event));

    this.fMediator.send<void>(new CanvasMovePreparationRequest(event));

    this.fMediator.send<void>(new ExternalItemPreparationRequest(event));

    this.fDraggableDataContext.draggableItems.forEach((item) => {
      item.initialize?.();
    });

    if (this.fDraggableDataContext.draggableItems.length > 0) {
      this.hostElement.classList.add('f-dragging');
    }
  }

  protected override onSelect(event: Event): void {
    const isTargetNotHtml = event.constructor.name === 'Event';
    const target = isTargetNotHtml ? (event.target as Node).parentNode as HTMLElement : event.target;
    if (target && isExternalItem(target as HTMLElement)) {
      event.preventDefault();
    }
  }

  public override onPointerMove(event: IPointerEvent): void {
    const pointerPositionInCanvas = Point.fromPoint(event.getPosition()).elementTransform(this.hostElement);
    const difference = pointerPositionInCanvas.div(this.fDraggableDataContext.onPointerDownScale).sub(this.fDraggableDataContext.onPointerDownPosition);
    this.fDraggableDataContext.draggableItems.forEach((item) => {
      item.move(difference);
    });
  }

  public override onPointerUp(event: IPointerEvent): void {
    this.fMediator.send<void>(new ReassignConnectionFinalizeRequest(event));

    this.fMediator.send<void>(new CreateConnectionFinalizeRequest(event));

    this.fMediator.send<void>(new SelectionAreaFinalizeRequest(event));

    this.fMediator.send<void>(new NodeResizeFinalizeRequest(event));

    this.fMediator.send<void>(new NodeMoveFinalizeRequest(event));

    this.fMediator.send<void>(new CanvasMoveFinalizeRequest(event));

    this.fMediator.send<void>(new ExternalItemFinalizeRequest(event));

    this.hostElement.classList.remove('f-dragging');

    this.fDraggableDataContext.reset();
  }

  protected override finalizeDragSequence(): void {
    this.emitSelectionChangeEvent();
  }

  private emitSelectionChangeEvent(): void {
    if (
      !this.fDraggableDataContext.isSelectedChanged
    ) {
      return;
    }
    this.fSelectionChange.emit(this.fMediator.send<FSelectionChangeEvent>(new GetSelectionRequest()));
    this.fDraggableDataContext.isSelectedChanged = false;
  }

  public ngOnDestroy(): void {
    super.unsubscribe();
    this.subscriptions$.unsubscribe();
  }
}

