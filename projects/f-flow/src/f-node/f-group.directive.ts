import {
  AfterViewInit,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { IRect, ISize, PointExtensions } from '@foblex/2d';
import { F_NODE, FNodeBase } from './f-node-base';
import { NotifyTransformChangedRequest } from '../f-storage';
import { IHasHostElement } from '../i-has-host-element';
import {
  AddNodeToStoreRequest,
  UpdateNodeWhenStateOrSizeChangedRequest,
  RemoveNodeFromStoreRequest,
  CalculateNodeConnectorsConnectableSidesRequest,
} from '../domain';
import { FMediator } from '@foblex/mediator';

let uniqueId = 0;
const _DEBOUNCE_TIME = 3;

@Directive({
  selector: '[fGroup]',
  exportAs: 'fComponent',
  host: {
    '[attr.data-f-group-id]': 'fId()',
    class: 'f-group f-component',
    '[class.f-group-dragging-disabled]': 'fDraggingDisabled()',
    '[class.f-group-selection-disabled]': 'fSelectionDisabled()',
  },
  providers: [{ provide: F_NODE, useExisting: FGroupDirective }],
})
export class FGroupDirective
  extends FNodeBase
  implements OnInit, AfterViewInit, IHasHostElement, OnDestroy
{
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _mediator = inject(FMediator);

  public override readonly fId = input<string>(`f-group-${uniqueId++}`, { alias: 'fGroupId' });

  public override readonly fParentId = input<string | null | undefined>(null, {
    alias: 'fGroupParentId',
  });

  public override readonly position = model(PointExtensions.initialize(), {
    alias: 'fGroupPosition',
  });

  public override readonly size = input<ISize | undefined>(undefined, {
    alias: 'fGroupSize',
  });

  public override sizeChange = output<IRect>({ alias: 'fGroupSizeChange' });

  public override readonly rotate = model(0, {
    alias: 'fGroupRotate',
  });

  public override readonly fConnectOnNode = input(true, {
    transform: booleanAttribute,
  });

  public override readonly fMinimapClass = input<string[] | string>([]);

  public override readonly fDraggingDisabled = input(false, {
    alias: 'fGroupDraggingDisabled',
    transform: booleanAttribute,
  });

  public override readonly fSelectionDisabled = input(false, {
    alias: 'fGroupSelectionDisabled',
    transform: booleanAttribute,
  });

  public override readonly fIncludePadding = input(true, {
    transform: booleanAttribute,
  });

  public override readonly fAutoExpandOnChildHit = input(false, {
    transform: booleanAttribute,
  });

  public override readonly fAutoSizeToFitChildren = input(false, {
    transform: booleanAttribute,
  });

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    elementReference: ElementRef<HTMLElement>,
  ) {
    super(elementReference.nativeElement);
    super.positionChanges();
    super.sizeChanges();
    super.rotateChanges();
    super.parentChanges();
  }

  public ngOnInit(): void {
    this.setStyle('position', 'absolute');
    this.setStyle('transform-origin', 'center');
    this.setStyle('user-select', 'none');
    this.setStyle('pointer-events', 'all');
    this.setStyle('left', '0');
    this.setStyle('top', '0');
    super.redraw();

    this._mediator.execute<void>(new AddNodeToStoreRequest(this));
  }

  protected override setStyle(styleName: string, value: string) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }

  protected override removeStyle(styleName: string) {
    this.renderer.removeStyle(this.hostElement, styleName);
  }

  public override redraw(): void {
    super.redraw();
    this._mediator.execute(new NotifyTransformChangedRequest());
    this._updateConnectorsSides();
  }

  protected _updateConnectorsSides(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(
      () => this._calculateNodeConnectorsConnectableSides(),
      _DEBOUNCE_TIME,
    );
  }

  private _calculateNodeConnectorsConnectableSides(): void {
    this._mediator.execute<void>(new CalculateNodeConnectorsConnectableSidesRequest(this));
  }

  public ngAfterViewInit(): void {
    if (!this.browser.isBrowser()) {
      return;
    }
    this._listenStateSizeChanges();
  }

  private _listenStateSizeChanges(): void {
    this._mediator.execute<void>(
      new UpdateNodeWhenStateOrSizeChangedRequest(this, this._destroyRef),
    );
  }

  public override refresh(): void {
    this.stateChanges.notify();
  }

  public ngOnDestroy(): void {
    this._mediator.execute<void>(new RemoveNodeFromStoreRequest(this));
  }
}
