import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NotifyDataChangedRequest } from '../../f-storage';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddConnectionToStoreRequest, RemoveConnectionFromStoreRequest } from '../../domain';
import { stringAttribute } from '../../utils';
import {
  EFConnectionBehavior,
  EFConnectionConnectableSide,
  EFConnectionType,
  F_CONNECTION_COMPONENTS_PARENT,
  FConnectionBase,
} from '../../f-connection-v2';

let uniqueId = 0;

@Component({
  selector: 'f-connection',
  exportAs: 'fComponent',
  templateUrl: './f-connection.component.html',
  styleUrls: ['./f-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'fId()',
    class: 'f-component f-connection',
    '[class.f-connection-selection-disabled]': 'fSelectionDisabled()',
    '[class.f-connection-reassign-disabled]': 'fDraggingDisabled()',
  },
  providers: [{ provide: F_CONNECTION_COMPONENTS_PARENT, useExisting: FConnectionComponent }],
})
export class FConnectionComponent extends FConnectionBase implements OnInit, OnChanges, OnDestroy {
  public override fId = input<string>(`f-connection-${uniqueId++}`, { alias: 'fConnectionId' });

  public override fOutputId = input<string, unknown>('', {
    transform: (value) => stringAttribute(value) || '',
  });

  public override fInputId = input<string, unknown>('', {
    transform: (value) => stringAttribute(value) || '',
  });

  @Input({ transform: numberAttribute })
  public override fRadius: number = 8;

  @Input({ transform: numberAttribute })
  public override fOffset: number = 12;

  @Input({ transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior) })
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

  public override fSelectionDisabled = input(false, { transform: booleanAttribute });

  public override fReassignableStart = input(false, { transform: booleanAttribute });

  public override fDraggingDisabled = input(false, {
    alias: 'fReassignDisabled',
    transform: booleanAttribute,
  });

  public override fInputSide = input(EFConnectionConnectableSide.DEFAULT, {
    transform: (x) => {
      return castToEnum(x, 'fInputSide', EFConnectionConnectableSide);
    },
  });

  public override fOutputSide = input(EFConnectionConnectableSide.DEFAULT, {
    transform: (x) => {
      return castToEnum(x, 'fOutputSide', EFConnectionConnectableSide);
    },
  });

  public override get boundingElement(): HTMLElement | SVGElement {
    return this.fPath().hostElement;
  }

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new AddConnectionToStoreRequest(this));
  }

  public ngOnChanges(): void {
    this._mediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveConnectionFromStoreRequest(this));
  }
}
