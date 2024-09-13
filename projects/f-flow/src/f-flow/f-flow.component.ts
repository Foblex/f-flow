import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ElementRef, EventEmitter,
  Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { F_FLOW, FFlowBase } from './f-flow-base';
import { Subscription } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import {
  ClearSelectionRequest,
  COMMON_PROVIDERS, GetScaledNodeRectsWithFlowPositionRequest, GetPositionInFlowRequest,
  GetSelectionRequest,
  RedrawConnectionsRequest,
  SelectAllRequest, SelectRequest, SortItemLayersRequest,
} from '../domain';
import { IPoint, IRect } from '@foblex/core';
import { FFlowMediator } from '../infrastructure';
import {
  F_DRAGGABLE_PROVIDERS,
  FDraggableDataContext, FSelectionChangeEvent
} from '../f-draggable';
import { FConnectionFactory } from '../f-connection';
import { FComponentsStore, FTransformStore } from '../f-storage';
import { BrowserService } from '@foblex/platform';

let uniqueId: number = 0;

@Component({
  selector: 'f-flow',
  templateUrl: './f-flow.component.html',
  styleUrls: [ './f-flow.component.scss' ],
  host: {
    '[attr.id]': 'fFlowId',
    class: "f-component f-flow",
  },
  providers: [
    FFlowMediator,
    FComponentsStore,
    FTransformStore,
    FDraggableDataContext,
    FConnectionFactory,
    ...F_DRAGGABLE_PROVIDERS,
    ...COMMON_PROVIDERS,
    { provide: F_FLOW, useExisting: FFlowComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FFlowComponent extends FFlowBase implements OnInit, AfterContentInit, OnDestroy {

  private subscription$: Subscription = new Subscription();

  @Input()
  public override fFlowId: string = `f-flow-${ uniqueId++ }`;

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @Output()
  public override fLoaded: EventEmitter<void> = new EventEmitter<void>();

  private isLoaded: boolean = false;

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
    private fBrowser: BrowserService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.fComponentsStore.fFlow = this;
  }

  public ngAfterContentInit(): void {
    if(!this.fBrowser.isBrowser()) {
      return;
    }
    this.subscription$.add(
      this.subscribeOnElementsChanges()
    );
    this.subscription$.add(
      this.subscribeOnComponentsCountChanges()
    );
  }

  private subscribeOnComponentsCountChanges(): Subscription {
    return this.fComponentsStore.componentsCount$.pipe(startWith(null), debounceTime(20)).subscribe(() => {
      this.fMediator.send(new SortItemLayersRequest());
    });
  }

  private subscribeOnElementsChanges(): Subscription {
    return this.fComponentsStore.componentsData$.pipe(startWith(null), debounceTime(20)).subscribe(() => {
      this.fMediator.send(new RedrawConnectionsRequest());

      if (!this.isLoaded) {
        this.isLoaded = true;
        setTimeout(() => {
          this.fLoaded.emit();
        })
      }
    });
  }

  public redraw(): void {
    this.fComponentsStore.componentDataChanged();
  }

  public reset(): void {
    this.isLoaded = false;
  }

  public getAllNodesRect(): IRect | null {
    return this.fMediator.send<IRect | null>(new GetScaledNodeRectsWithFlowPositionRequest());
  }

  public getSelection(): FSelectionChangeEvent {
    return this.fMediator.send<FSelectionChangeEvent>(new GetSelectionRequest());
  }

  public getPositionInFlow(position: IPoint): IRect {
    return this.fMediator.send(new GetPositionInFlowRequest(position));
  }

  public selectAll(): void {
    this.fMediator.send<void>(new SelectAllRequest());
  }

  public select(nodes: string[], connections: string[]): void {
    this.fMediator.send<void>(new SelectRequest(nodes, connections));
  }

  public clearSelection(): void {
    this.fMediator.send<void>(new ClearSelectionRequest());
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
