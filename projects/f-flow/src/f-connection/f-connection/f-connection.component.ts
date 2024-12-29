import {
  ChangeDetectionStrategy,
  Component, ContentChildren,
  ElementRef, inject,
  Input, OnChanges,
  OnDestroy,
  OnInit, QueryList,
  ViewChild
} from "@angular/core";
import {
  CONNECTION_GRADIENT,
  CONNECTION_PATH,
  CONNECTION_TEXT,
  FConnectionDragHandleComponent,
  FConnectionSelectionComponent,
  IConnectionGradient,
  IConnectionPath, IConnectionText,
} from '../common';
import { EFConnectionBehavior } from '../common';
import { EFConnectionType } from '../common';
import { NotifyDataChangedRequest } from '../../f-storage';
import { FConnectionCenterDirective } from '../f-connection-center';
import { FConnectionFactory } from '../f-connection-builder';
import { F_CONNECTION } from '../common/f-connection.injection-token';
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddConnectionToStoreRequest } from '../../domain';
import { RemoveConnectionFromStoreRequest } from '../../domain';

let uniqueId: number = 0;

@Component({
  selector: "f-connection",
  exportAs: 'fComponent',
  templateUrl: "./f-connection.component.html",
  styleUrls: [ "./f-connection.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'fId',
    class: "f-component f-connection",
    '[class.f-connection-selection-disabled]': 'fSelectionDisabled',
    '[class.f-connection-reassign-disabled]': 'fDraggingDisabled',
  },
  providers: [ { provide: F_CONNECTION, useExisting: FConnectionComponent } ],
})
export class FConnectionComponent
  extends FConnectionBase implements OnInit, OnChanges, OnDestroy {

  @Input('fConnectionId')
  public override fId: string = `f-connection-${ uniqueId++ }`;

  @Input()
  public override fText: string = '';

  @Input()
  public override fTextStartOffset: string = '';

  @Input()
  public override fStartColor: string = 'black';

  @Input()
  public override fEndColor: string = 'black';

  @Input()
  public override fOutputId: string = '';

  @Input()
  public override fInputId: string = '';

  @Input()
  public override fRadius: number = 8;

  @Input()
  public override fOffset: number = 32

  @Input({ transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior) })
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

  @Input('fReassignDisabled')
  public override fDraggingDisabled: boolean = false;

  @Input()
  public override fSelectionDisabled: boolean = false;

  @ViewChild('defs', { static: true })
  public override fDefs!: ElementRef<SVGDefsElement>;

  @ViewChild(CONNECTION_PATH, { static: true })
  public override fPath!: IConnectionPath;

  @ViewChild(CONNECTION_GRADIENT, { static: true })
  public override fGradient!: IConnectionGradient;

  @ViewChild(FConnectionDragHandleComponent, { static: true })
  public override fDragHandle!: FConnectionDragHandleComponent;

  @ViewChild(FConnectionSelectionComponent, { static: true })
  public override fSelection!: FConnectionSelectionComponent;

  @ViewChild(CONNECTION_TEXT, { static: true })
  public override fTextComponent!: IConnectionText;

  @ViewChild('fConnectionCenter', { static: false })
  public override fConnectionCenter!: ElementRef<HTMLDivElement>;

  @ContentChildren(FConnectionCenterDirective, { descendants: true })
  public fConnectionCenters!: QueryList<FConnectionCenterDirective>;

  public override get boundingElement(): HTMLElement | SVGElement {
    return this.fPath.hostElement;
  }

  private _fMediator = inject(FMediator);

  constructor(
    elementReference: ElementRef<HTMLElement>,
    fConnectionFactory: FConnectionFactory,
  ) {
    super(elementReference, fConnectionFactory);
  }

  public ngOnInit(): void {
    this._fMediator.send(new AddConnectionToStoreRequest(this));
  }

  public ngOnChanges(): void {
    this._fMediator.send(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.send(new RemoveConnectionFromStoreRequest(this));
  }
}
