import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, DestroyRef, ElementRef, inject, input, OnDestroy, OnInit, output,
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
  GetFlowStateRequest, RemoveFlowFromStoreRequest, AddFlowToStoreRequest, SortItemLayersRequest, ICurrentSelection,
} from '../domain';
import { IPoint, IRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import {
  FDraggableDataContext,
} from '../f-draggable';
import { FConnectionFactory } from '../f-connection';
import {
  NotifyDataChangedRequest,
  F_STORAGE_PROVIDERS,
  ListenCountChangesRequest,
  ListenDataChangesRequest,
} from '../f-storage';
import { BrowserService } from '@foblex/platform';
import { COMMON_PROVIDERS } from '../domain';
import { F_DRAGGABLE_PROVIDERS } from '../f-draggable';
import { FChannelHub } from '../reactivity';

let uniqueId = 0;

@Component({
  selector: 'f-flow',
  templateUrl: './f-flow.component.html',
  styleUrls: ['./f-flow.component.scss'],
  standalone: true,
  host: {
    '[attr.id]': 'fId()',
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

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fMediator = inject(FMediator);
  private readonly _browserService = inject(BrowserService);
  private readonly _elementReference = inject(ElementRef);

  public override fId = input<string>(`f-flow-${uniqueId++}`, { alias: 'fFlowId' });

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public override fLoaded = output<string>();

  private _isLoaded: boolean = false;

  public ngOnInit(): void {
    this._fMediator.execute(new AddFlowToStoreRequest(this));
  }

  public ngAfterContentInit(): void {
    if (!this._browserService.isBrowser()) {
      return;
    }
    this._listenCountChanges();
    this._listenDataChanges();
  }

  private _listenCountChanges(): void {
    this._fMediator.execute<FChannelHub>(
      new ListenCountChangesRequest(),
    ).listen(this._destroyRef, () => {
      this._fMediator.execute(new SortItemLayersRequest())
    });
  }

  private _listenDataChanges(): void {
    this._fMediator.execute<FChannelHub>(
      new ListenDataChangesRequest(),
    ).listen(this._destroyRef, () => {
      this._fMediator.execute(new RedrawConnectionsRequest());

      this._emitLoaded();
    });
  }

  private _emitLoaded(): void {
    if (!this._isLoaded) {
      this._isLoaded = true;
      this.fLoaded.emit(this.fId());
    }
  }

  public redraw(): void {
    this._fMediator.execute(new NotifyDataChangedRequest());
  }

  public reset(): void {
    this._isLoaded = false;
  }

  public getNodesBoundingBox(): IRect | null {
    return this._fMediator.execute<IRect | null>(new CalculateNodesBoundingBoxNormalizedPositionRequest());
  }

  public getSelection(): ICurrentSelection {
    return this._fMediator.execute<ICurrentSelection>(new GetCurrentSelectionRequest());
  }

  public getPositionInFlow(position: IPoint): IRect {
    return this._fMediator.execute(new GetNormalizedPointRequest(position));
  }

  public getState(): IFFlowState {
    return this._fMediator.execute(new GetFlowStateRequest());
  }

  public selectAll(): void {
    setTimeout(() => {
      this._fMediator.execute<void>(new SelectAllRequest());
    });
  }

  /**
   * Programmatically selects nodes and connections by their IDs.
   *
   * This method allows external components to control the selection state of the canvas.
   * Selected elements will appear visually highlighted. If `isSelectedChanged` is true,
   * the next user interaction (e.g., clicking the canvas) will emit a selection change event.
   *
   * @param nodes - An array of node IDs to select.
   * @param connections - An array of connection IDs to select.
   * @param isSelectedChanged - Optional. If true (default), marks the selection state as changed,
   * triggering a `fSelectionChange` event on the next user interaction.
   */
  public select(nodes: string[], connections: string[], isSelectedChanged: boolean = true): void {
    setTimeout(() => {
      this._fMediator.execute<void>(new SelectRequest(nodes, connections, isSelectedChanged));
    });
  }

  public clearSelection(): void {
    this._fMediator.execute<void>(new ClearSelectionRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.execute(new RemoveFlowFromStoreRequest());
  }
}
