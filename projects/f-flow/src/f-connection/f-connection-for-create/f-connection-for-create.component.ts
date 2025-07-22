import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, contentChildren,
  ElementRef,
  inject, input,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  signal, viewChild
} from "@angular/core";
import {
  CONNECTION_GRADIENT,
  CONNECTION_PATH,
  CONNECTION_TEXT,
  FConnectionDragHandleEndComponent,
  FConnectionDragHandleStartComponent,
  FConnectionSelectionComponent,
  IConnectionGradient,
  IConnectionPath,
  IConnectionText,
} from '../common';
import {EFConnectionBehavior} from '../common';
import {EFConnectionType} from '../common';
import {FConnectionCenterDirective} from '../f-connection-center';
import {FConnectionFactory} from '../f-connection-builder';
import {NotifyDataChangedRequest} from '../../f-storage';
import {F_CONNECTION} from '../common/f-connection.injection-token';
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import {FConnectionBase} from '../common/f-connection-base';
import {castToEnum} from '@foblex/utils';
import {FMediator} from '@foblex/mediator';
import {AddConnectionForCreateToStoreRequest, RemoveConnectionForCreateFromStoreRequest} from '../../domain';

let uniqueId: number = 0;

@Component({
  selector: "f-connection-for-create",
  templateUrl: "./f-connection-for-create.component.html",
  styleUrls: ["./f-connection-for-create.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection f-connection-for-create"
  },
  providers: [{provide: F_CONNECTION, useExisting: FConnectionForCreateComponent}],
})
export class FConnectionForCreateComponent
  extends FConnectionBase implements AfterViewInit, OnInit, OnChanges, OnDestroy {

  public override fId = signal<string>(`f-connection-for-create-${uniqueId++}`);

  public override fText: string = '';

  public override fTextStartOffset: string = '';

  public override fStartColor = input<string>('black');

  public override fEndColor = input<string>('black');

  public override fOutputId!: string;

  public override fInputId!: string;

  @Input({transform: numberAttribute})
  public override fRadius: number = 8;

  @Input({transform: numberAttribute})
  public override fOffset: number = 12;

  @Input({transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior)})
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

  public override fDraggingDisabled: boolean = false;

  public override fSelectionDisabled: boolean = false;

  public override fDefs = viewChild.required<ElementRef<SVGDefsElement>>('defs');

  public override fPath = viewChild.required<IConnectionPath>(CONNECTION_PATH);

  public override fGradient = viewChild.required<IConnectionGradient>(CONNECTION_GRADIENT);

  public override fDragHandleEnd = viewChild.required(FConnectionDragHandleEndComponent);
  public override fDragHandleStart = viewChild.required(FConnectionDragHandleStartComponent);

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
    fConnectionFactory: FConnectionFactory
  ) {
    super(elementReference, fConnectionFactory);
  }

  public ngOnInit(): void {
    this._fMediator.execute(new AddConnectionForCreateToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    this.hide();
  }

  public ngOnChanges(): void {
    this._fMediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.execute(new RemoveConnectionForCreateFromStoreRequest());
  }
}
