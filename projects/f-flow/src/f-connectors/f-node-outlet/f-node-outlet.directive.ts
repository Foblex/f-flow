import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { F_NODE_OUTLET, FNodeOutletBase } from './f-node-outlet-base';
import { F_NODE } from '../../f-node';
import { EFConnectableSide } from '../e-f-connectable-side';
import { FMediator } from '@foblex/mediator';
import { AddOutletToStoreRequest, RemoveOutletFromStoreRequest } from '../../domain';

let uniqueId = 0;

@Directive({
  selector: '[fNodeOutlet]',
  exportAs: 'fNodeOutlet',
  host: {
    '[attr.data-f-outlet-id]': 'fId',
    class: 'f-component f-node-outlet',
    '[class.f-node-outlet-disabled]': 'disabled',
  },
  providers: [{ provide: F_NODE_OUTLET, useExisting: FNodeOutletDirective }],
})
export class FNodeOutletDirective extends FNodeOutletBase implements OnInit, OnDestroy {
  public readonly hostElement = inject(ElementRef).nativeElement;

  private readonly _mediator = inject(FMediator);
  private readonly _node = inject(F_NODE);

  @Input('fOutletId')
  public override fId: string = `f-node-outlet-${uniqueId++}`;

  @Input({ alias: 'fOutletDisabled', transform: booleanAttribute })
  public override disabled: boolean = false;

  public override fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input()
  public override isConnectionFromOutlet: boolean = false;

  @Input({ alias: 'fCanBeConnectedInputs' })
  public override canBeConnectedInputs: string[] = [];

  public override get fNodeId(): string {
    return this._node.fId();
  }

  public ngOnInit() {
    this._mediator.execute(new AddOutletToStoreRequest(this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveOutletFromStoreRequest(this));
  }
}
