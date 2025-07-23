import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, contentChildren,
  ElementRef,
  inject, input,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  viewChild,
} from "@angular/core";
import {
  CONNECTION_GRADIENT,
  CONNECTION_PATH,
  CONNECTION_TEXT,
  EFConnectionBehavior,
  EFConnectionType,
  FConnectionDragHandleEndComponent, FConnectionDragHandleStartComponent,
  FConnectionSelectionComponent,
  IConnectionGradient,
  IConnectionPath,
  IConnectionText,
} from '../common';
import {NotifyDataChangedRequest} from '../../f-storage';
import {FConnectionCenterDirective} from '../f-connection-center';
import {FConnectionFactory} from '../f-connection-builder';
import {F_CONNECTION} from '../common/f-connection.injection-token';
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import {FConnectionBase} from '../common/f-connection-base';
import {castToEnum} from '@foblex/utils';
import {FMediator} from '@foblex/mediator';
import {AddConnectionToStoreRequest, RemoveConnectionFromStoreRequest} from '../../domain';

let uniqueId: number = 0;

@Component({
  selector: "f-connection",
  exportAs: 'fComponent',
  templateUrl: "./f-connection.component.html",
  styleUrls: ["./f-connection.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'fId()',
    class: "f-component f-connection",
    '[class.f-connection-selection-disabled]': 'fSelectionDisabled',
    '[class.f-connection-reassign-disabled]': 'fDraggingDisabled',
  },
  providers: [{provide: F_CONNECTION, useExisting: FConnectionComponent}],
})
export class FConnectionComponent
  extends FConnectionBase implements OnInit, OnChanges, OnDestroy {

  public override fId = input<string>(`f-connection-${uniqueId++}`, {alias: 'fConnectionId'});

  @Input()
  public override fText: string = '';

  @Input()
  public override fTextStartOffset: string = '';

  public override fStartColor = input<string>('black');

  public override fEndColor = input<string>('black');

  @Input()
  public override fOutputId: any = '';

  @Input()
  public override fInputId: any = '';

  @Input({transform: numberAttribute})
  public override fRadius: number = 8;

  @Input({transform: numberAttribute})
  public override fOffset: number = 12;

  @Input({transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior)})
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

  public override fReassignableStart = input<boolean>(false);

  @Input({alias: 'fReassignDisabled', transform: booleanAttribute})
  public override fDraggingDisabled: boolean = false;

  @Input({transform: booleanAttribute})
  public override fSelectionDisabled: boolean = false;

  public override fDefs = viewChild.required<ElementRef<SVGDefsElement>>('defs');

  public override fPath = viewChild.required<IConnectionPath>(CONNECTION_PATH);

  public override fGradient = viewChild.required<IConnectionGradient>(CONNECTION_GRADIENT);

  public override fDragHandleStart = viewChild(FConnectionDragHandleStartComponent);
  public override fDragHandleEnd = viewChild.required(FConnectionDragHandleEndComponent);

  public override fSelection = viewChild.required(FConnectionSelectionComponent);

  public override fTextComponent = viewChild.required<IConnectionText>(CONNECTION_TEXT);

  public override fConnectionCenter = viewChild<ElementRef<HTMLDivElement>>('fConnectionCenter');

  public fConnectionCenters = contentChildren(FConnectionCenterDirective, {descendants: true});

  public override get boundingElement(): HTMLElement | SVGElement {
    return this.fPath().hostElement;
  }

  private readonly _fMediator = inject(FMediator);

  constructor(
    elementReference: ElementRef<HTMLElement>,
    fConnectionFactory: FConnectionFactory,
  ) {
    super(elementReference, fConnectionFactory);
  }

  public ngOnInit(): void {
    this._fMediator.execute(new AddConnectionToStoreRequest(this));
  }

  public ngOnChanges(): void {
    this._fMediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.execute(new RemoveConnectionFromStoreRequest(this));
  }
}
