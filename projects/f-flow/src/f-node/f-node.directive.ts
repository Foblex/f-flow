import {
  AfterViewInit, DestroyRef,
  Directive,
  ElementRef,
  EventEmitter, inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { IPoint, IRect, ISize, PointExtensions } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { merge } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { FResizeObserver } from './f-resize-observer';
import { FComponentsStore, TransformChangedRequest } from '../f-storage';
import {
  FConnectorBase
} from '../f-connectors';
import { FMediator } from '@foblex/mediator';
import { F_NODE, FNodeBase } from './f-node-base';
import { IHasHostElement } from '../i-has-host-element';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let uniqueId: number = 0;

@Directive({
  selector: "[fNode]",
  exportAs: "fComponent",
  host: {
    '[attr.data-f-node-id]': 'fId',
    class: "f-node f-component",
    '[class.f-node-dragging-disabled]': 'fDraggingDisabled',
    '[class.f-node-selection-disabled]': 'fSelectionDisabled',
  },
  providers: [
    { provide: F_NODE, useExisting: FNodeDirective }
  ],
})
export class FNodeDirective extends FNodeBase implements OnInit, AfterViewInit, IHasHostElement, OnDestroy {

  @Input('fNodeId')
  public override fId: string = `f-node-${ uniqueId++ }`;

  @Input('fNodeParentId')
  public override fParentId: string | null | undefined = null;

  @Input('fNodePosition')
  public override set position(value: IPoint) {
    this._position = PointExtensions.castToPoint(value);
    this.refresh();
  }

  public override get position(): IPoint {
    return this._position;
  }

  @Output('fNodePositionChange')
  public override positionChange: EventEmitter<IPoint> = new EventEmitter<IPoint>();

  @Input('fNodeSize')
  public override set size(value: ISize) {
    this._size = value;
    this.refresh();
  }

  public override get size(): ISize {
    return this._size!;
  }

  @Output('fNodeSizeChange')
  public override sizeChange: EventEmitter<IRect> = new EventEmitter<IRect>();

  @Input('fNodeDraggingDisabled')
  public override fDraggingDisabled: boolean = false;

  @Input('fNodeSelectionDisabled')
  public override fSelectionDisabled: boolean = false;

  @Input()
  public override fIncludePadding: boolean = true;

  //TODO: Add ability to connect to first connectable input if node is under pointer
  @Input()
  public override fConnectOnNode: boolean = true;

  public override connectors: FConnectorBase[] = [];

  private _destroyRef = inject(DestroyRef);

  constructor(
    elementReference: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
    private fBrowser: BrowserService
  ) {
    super(elementReference.nativeElement);
  }

  public ngOnInit(): void {
    this.setStyle('position', 'absolute');
    this.setStyle('transform-origin', 'center');
    this.setStyle('user-select', 'none');
    this.setStyle('pointer-events', 'all');
    this.setStyle('left', '0');
    this.setStyle('top', '0');
    super.redraw();
    this.fComponentsStore.addComponent(this.fComponentsStore.fNodes, this);
  }

  protected override setStyle(styleName: string, value: string) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }

  public override redraw(): void {
    super.redraw();
    this.fMediator.send(new TransformChangedRequest());
  }

  public ngAfterViewInit(): void {
    if(!this.fBrowser.isBrowser()) {
      return;
    }
    this._subscribeOnResizeChanges();
  }

  private _subscribeOnResizeChanges(): void {
    merge(new FResizeObserver(this.hostElement as HTMLElement), this.stateChanges).pipe(
      debounceTime(10), startWith(null), takeUntilDestroyed(this._destroyRef)
    ).subscribe(() => {
      this.calculateConnectorsSides();
      this.fComponentsStore.componentDataChanged();
    });
  }

  public override addConnector(connector: FConnectorBase): void {
    this.connectors.push(connector);
    this.refresh();
  }

  public override removeConnector(connector: FConnectorBase): void {
    const index = this.connectors.indexOf(connector);
    if (index !== -1) {
      this.connectors.splice(index, 1);
    }
    this.refresh();
  }

  public refresh(): void {
    this.stateChanges.next();
  }

  public ngOnDestroy(): void {
    this.fComponentsStore.removeComponent(this.fComponentsStore.fNodes, this);
    this.stateChanges.complete();
  }
}
