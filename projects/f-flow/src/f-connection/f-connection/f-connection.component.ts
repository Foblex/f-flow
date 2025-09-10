import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, input,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  EFConnectionBehavior,
  EFConnectionType,
} from '../common';
import { NotifyDataChangedRequest } from '../../f-storage';
import { FConnectionFactory } from '../f-connection-builder';
import { F_CONNECTION } from '../common/f-connection.injection-token';
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddConnectionToStoreRequest, RemoveConnectionFromStoreRequest } from '../../domain';

let uniqueId = 0;

@Component({
  selector: "f-connection",
  exportAs: 'fComponent',
  templateUrl: "./f-connection.component.html",
  styleUrls: ["./f-connection.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'fId()',
    class: "f-component f-connection",
    '[class.f-connection-selection-disabled]': 'fSelectionDisabled()',
    '[class.f-connection-reassign-disabled]': 'fDraggingDisabled()',
  },
  providers: [{ provide: F_CONNECTION, useExisting: FConnectionComponent }],
})
export class FConnectionComponent
  extends FConnectionBase implements OnInit, OnChanges, OnDestroy {

  public override fId = input<string>(`f-connection-${uniqueId++}`, { alias: 'fConnectionId' });

  @Input()
  public override fText: string = '';

  @Input()
  public override fTextStartOffset: string = '';

  @Input()
  public override fOutputId: any = '';

  @Input()
  public override fInputId: any = '';

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

  public override get boundingElement(): HTMLElement | SVGElement {
    return this.fPath().hostElement;
  }

  private readonly _mediator = inject(FMediator);

  constructor(
    elementReference: ElementRef<HTMLElement>,
    fConnectionFactory: FConnectionFactory,
  ) {
    super(elementReference, fConnectionFactory);
  }

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
