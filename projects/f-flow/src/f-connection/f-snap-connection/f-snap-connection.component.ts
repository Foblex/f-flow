import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { EFConnectionBehavior } from '../common';
import { EFConnectionType } from '../common';
import { NotifyDataChangedRequest } from '../../f-storage';
import { F_CONNECTION } from '../common/f-connection.injection-token';
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import {
  AddSnapConnectionToStoreRequest,
  RemoveSnapConnectionFromStoreRequest,
} from '../../domain';

let uniqueId = 0;

@Component({
  selector: 'f-snap-connection',
  templateUrl: './f-snap-connection.component.html',
  styleUrls: ['./f-snap-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection f-snap-connection',
  },
  providers: [{ provide: F_CONNECTION, useExisting: FSnapConnectionComponent }],
})
export class FSnapConnectionComponent
  extends FConnectionBase
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  public override fId = signal<string>(`f-snap-connection-${uniqueId++}`);

  public override fText: string = '';

  public override fTextStartOffset: string = '';

  @Input({ transform: numberAttribute })
  public fSnapThreshold: number = 20;

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

  public override get boundingElement(): HTMLElement | SVGElement {
    return this.fPath().hostElement;
  }

  private readonly _mediator = inject(FMediator);

  public ngOnInit(): void {
    this._mediator.execute(new AddSnapConnectionToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    this.hide();
  }

  public ngOnChanges(): void {
    this._mediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveSnapConnectionFromStoreRequest());
  }
}
