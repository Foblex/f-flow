import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NotifyDataChangedRequest } from '../../f-storage';
import { FConnectionBase } from '../models';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import {
  AddConnectionForCreateToStoreRequest,
  RemoveConnectionForCreateFromStoreRequest,
} from '../../domain';
import {
  EFConnectionBehavior,
  EFConnectionConnectableSide,
  EFConnectionType,
  F_INJECTABLE_CONNECTION,
} from '../../f-connection-v2';

let uniqueId = 0;

@Component({
  selector: 'f-connection-for-create',
  templateUrl: './f-connection-for-create.component.html',
  styleUrls: ['./f-connection-for-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection f-connection-for-create',
  },
  providers: [{ provide: F_INJECTABLE_CONNECTION, useExisting: FConnectionForCreateComponent }],
})
export class FConnectionForCreateComponent
  extends FConnectionBase
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  public override fId = signal<string>(`f-connection-for-create-${uniqueId++}`);

  public override fOutputId = signal('');

  public override fInputId = signal('');

  @Input({ transform: numberAttribute })
  public override fRadius: number = 8;

  @Input({ transform: numberAttribute })
  public override fOffset: number = 12;

  @Input({ transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior) })
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

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
    this._mediator.execute(new AddConnectionForCreateToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    this.hide();
  }

  public ngOnChanges(): void {
    this._mediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveConnectionForCreateFromStoreRequest());
  }
}
