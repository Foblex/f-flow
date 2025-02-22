import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild
} from "@angular/core";
import {
  CONNECTION_GRADIENT,
  CONNECTION_PATH, CONNECTION_TEXT,
  FConnectionDragHandleEndComponent, FConnectionSelectionComponent, IConnectionGradient,
  IConnectionPath, IConnectionText,
} from '../common';
import { EFConnectionBehavior } from '../common';
import { EFConnectionType } from '../common';
import { FConnectionCenterDirective } from '../f-connection-center';
import { FConnectionFactory } from '../f-connection-builder';
import { NotifyDataChangedRequest } from '../../f-storage';
import { F_CONNECTION } from '../common/f-connection.injection-token';
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddSnapConnectionToStoreRequest, RemoveSnapConnectionFromStoreRequest } from '../../domain';

let uniqueId: number = 0;

@Component({
  selector: "f-snap-connection",
  templateUrl: "./f-snap-connection.component.html",
  styleUrls: [ "./f-snap-connection.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection f-snap-connection"
  },
  providers: [ { provide: F_CONNECTION, useExisting: FSnapConnectionComponent } ],
})
export class FSnapConnectionComponent
  extends FConnectionBase implements AfterViewInit, OnInit, OnChanges, OnDestroy {

  public override fId: string = `f-snap-connection-${ uniqueId++ }`;

  public override fText: string = '';

  public override fTextStartOffset: string = '';

  @Input()
  public override fStartColor: string = 'black';

  @Input()
  public override fEndColor: string = 'black';

  @Input({ transform: numberAttribute })
  public fSnapThreshold: number = 20;

  public override fOutputId!: string;

  public override fInputId!: string;

  @Input({ transform: numberAttribute })
  public override fRadius: number = 8;

  @Input({ transform: numberAttribute })
  public override fOffset: number = 32

  @Input({ transform: (value: unknown) => castToEnum(value, 'fBehavior', EFConnectionBehavior) })
  public override fBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override fType: EFConnectionType | string = EFConnectionType.STRAIGHT;

  public override fDraggingDisabled: boolean = false;

  public override fSelectionDisabled: boolean = false;

  @ViewChild('defs', { static: true })
  public override fDefs!: ElementRef<SVGDefsElement>;

  @ViewChild(CONNECTION_PATH, { static: true })
  public override fPath!: IConnectionPath;

  @ViewChild(CONNECTION_GRADIENT, { static: true })
  public override fGradient!: IConnectionGradient;

  @ViewChild(FConnectionDragHandleEndComponent, { static: true })
  public override fDragHandle!: FConnectionDragHandleEndComponent;

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
