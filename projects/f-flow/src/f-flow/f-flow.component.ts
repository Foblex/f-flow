import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, DestroyRef, ElementRef, EventEmitter, inject,
  Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { F_FLOW, FFlowBase } from './f-flow-base';
import {
  ClearSelectionRequest,
  CalculateNodesBoundingBoxNormalizedPositionRequest,
  GetNormalizedPointRequest,
  GetCurrentSelectionRequest,
  RedrawConnectionsRequest,
  SelectAllRequest,
  SelectRequest,
  IFFlowState,
  GetFlowStateRequest, RemoveFlowFromStoreRequest, AddFlowToStoreRequest, SortItemLayersRequest, ICurrentSelection
} from '../domain';
import { IPoint, IRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import {
  FDraggableDataContext
} from '../f-draggable';
import { FConnectionFactory } from '../f-connection';
import {
  NotifyDataChangedRequest,
  F_STORAGE_PROVIDERS,
  ListenCountChangesRequest,
  ListenDataChangesRequest
} from '../f-storage';
import { BrowserService } from '@foblex/platform';
import { COMMON_PROVIDERS } from '../domain';
import { F_DRAGGABLE_PROVIDERS } from '../f-draggable';
import { FChannelHub } from '../reactivity';

let uniqueId: number = 0;

@Component({
  selector: 'f-flow',
  templateUrl: './f-flow.component.html',
  styleUrls: [ './f-flow.component.scss' ],
  host: {
    '[attr.id]': 'fId',
    class: "f-component f-flow",
  },
  providers: [
    FMediator,
    ...F_STORAGE_PROVIDERS,
    FDraggableDataContext,
    FConnectionFactory,
    ...COMMON_PROVIDERS,
    ...F_DRAGGABLE_PROVIDERS,
    { provide: F_FLOW, useExisting: FFlowComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FFlowComponent extends FFlowBase implements OnInit, AfterContentInit, OnDestroy {

  private _destroyRef = inject(DestroyRef);

  private _fMediator = inject(FMediator);

  private _elementReference = inject(ElementRef);

  @Input('fFlowId')
  public override fId: string = `f-flow-${ uniqueId++ }`;

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @Output()
  public override fLoaded: EventEmitter<void> = new EventEmitter<void>();

  private _isLoaded: boolean = false;

  constructor(
    private fBrowser: BrowserService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this._fMediator.send(new AddFlowToStoreRequest(this));
  }

  public ngAfterContentInit(): void {
    if (!this.fBrowser.isBrowser()) {
      return;
    }
    this._listenCountChanges();
    this._listenDataChanges();
  }

  private _listenCountChanges(): void {
    this._fMediator.send<FChannelHub>(
      new ListenCountChangesRequest()
    ).listen(this._destroyRef, () => {
      this._fMediator.send(new SortItemLayersRequest())
    });
  }

  private _listenDataChanges(): void {
    this._fMediator.send<FChannelHub>(
      new ListenDataChangesRequest()
    ).listen(this._destroyRef,() => {
      this._fMediator.send(new RedrawConnectionsRequest());

      this._emitLoaded();
    });
  }

  private _emitLoaded(): void {
    if (!this._isLoaded) {
      this._isLoaded = true;
      this.fLoaded.emit();
    }
  }

  public redraw(): void {
    this._fMediator.send(new NotifyDataChangedRequest());
  }

  public reset(): void {
    this._isLoaded = false;
  }

  public getNodesBoundingBox(): IRect | null {
    return this._fMediator.send<IRect | null>(new CalculateNodesBoundingBoxNormalizedPositionRequest());
  }

  public getSelection(): ICurrentSelection {
    return this._fMediator.send<ICurrentSelection>(new GetCurrentSelectionRequest());
  }

  public getPositionInFlow(position: IPoint): IRect {
    return this._fMediator.send(new GetNormalizedPointRequest(position));
  }

  public getState(): IFFlowState {
    return this._fMediator.send(new GetFlowStateRequest());
  }

  public selectAll(): void {
    this._fMediator.send<void>(new SelectAllRequest());
  }

  public select(nodes: string[], connections: string[]): void {
    this._fMediator.send<void>(new SelectRequest(nodes, connections));
  }

  public clearSelection(): void {
    this._fMediator.send<void>(new ClearSelectionRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.send(new RemoveFlowFromStoreRequest());
  }
}
