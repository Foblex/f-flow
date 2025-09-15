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
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import {
  AddConnectionForCreateToStoreRequest,
  RemoveConnectionForCreateFromStoreRequest,
} from '../../domain';

let uniqueId = 0;

@Component({
  selector: 'f-connection-for-create',
  templateUrl: './f-connection-for-create.component.html',
  styleUrls: ['./f-connection-for-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection f-connection-for-create',
  },
  providers: [{ provide: F_CONNECTION, useExisting: FConnectionForCreateComponent }],
})
export class FConnectionForCreateComponent
  extends FConnectionBase
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  public override fId = signal<string>(`f-connection-for-create-${uniqueId++}`);

  public override fText: string = '';

  public override fTextStartOffset: string = '';

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
