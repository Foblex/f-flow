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
  signal,
  viewChild,
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
import {FConnectionBase} from '../common/f-connection-base';
import {castToEnum} from '@foblex/utils';
import {FMediator} from '@foblex/mediator';
import {AddSnapConnectionToStoreRequest, RemoveSnapConnectionFromStoreRequest} from '../../domain';

let uniqueId: number = 0;

@Component({
  selector: "f-snap-connection",
  templateUrl: "./f-snap-connection.component.html",
  styleUrls: ["./f-snap-connection.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection f-snap-connection"
  },
  providers: [{provide: F_CONNECTION, useExisting: FSnapConnectionComponent}],
})
export class FSnapConnectionComponent
  extends FConnectionBase implements AfterViewInit, OnInit, OnChanges, OnDestroy {

  public override fId = signal<string>(`f-snap-connection-${uniqueId++}`);

  public override fText: string = '';

  public override fTextStartOffset: string = '';

  public override fStartColor = input<string>('black');

  public override fEndColor = input<string>('black');

  @Input({transform: numberAttribute})
  public fSnapThreshold: number = 20;

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
    this._fMediator.execute(new AddSnapConnectionToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    this.hide();
  }

  public ngOnChanges(): void {
    this._fMediator.execute(new NotifyDataChangedRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.execute(new RemoveSnapConnectionFromStoreRequest());
  }
}
