import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, ContentChildren, ElementRef, inject, Input, OnDestroy, OnInit, QueryList, ViewChild
} from "@angular/core";
import {
  CONNECTION_GRADIENT,
  CONNECTION_PATH, CONNECTION_TEXT,
  FConnectionDragHandleComponent, FConnectionSelectionComponent, IConnectionGradient,
  IConnectionPath, IConnectionText,
} from '../common';
import { EFConnectionBehavior } from '../common';
import { EFConnectionType } from '../common';
import { FConnectionCenterDirective } from '../f-connection-center';
import { FConnectionFactory } from '../f-connection-builder';
import { ComponentsDataChangedRequest } from '../../f-storage';
import { F_CONNECTION } from '../common/f-connection.injection-token';
//TODO: Need to deal with cyclic dependencies, since in some cases an error occurs when importing them ../common
// TypeError: Class extends value undefined is not a constructor or null
// at f-connection-for-create.component.ts:34:11
import { FConnectionBase } from '../common/f-connection-base';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddConnectionForCreateToStoreRequest, RemoveConnectionForCreateFromStoreRequest } from '../../domain';

let uniqueId: number = 0;

@Component({
  selector: "f-connection-for-create",
  templateUrl: "./f-connection-for-create.component.html",
  styleUrls: [ "./f-connection-for-create.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection f-connection-for-create"
  },
  providers: [ { provide: F_CONNECTION, useExisting: FConnectionForCreateComponent } ],
})
export class FConnectionForCreateComponent
  extends FConnectionBase implements AfterViewInit, OnInit, OnDestroy {

  public override fId: string = `f-connection-for-create-${ uniqueId++ }`;

  public override fText: string = '';

  private _fStartColor: string = 'black';
  @Input()
  public override set fStartColor(value: string) {
    this._fStartColor = value;
    this._componentDataChanged();
  }

  public override get fStartColor(): string {
    return this._fStartColor;
  }

  private _fEndColor: string = 'black';
  @Input()
  public override set fEndColor(value: string) {
    this._fEndColor = value;
    this._componentDataChanged();
  }

  public override get fEndColor(): string {
    return this._fEndColor;
  }

  public override fOutputId!: string;

  public override fInputId!: string;

  private _fRadius: number = 8;
  @Input()
  public override set fRadius(value: number) {
    this._fRadius = value;
    this._componentDataChanged();
  }

  public override get fRadius(): number {
    return this._fRadius;
  }

  private _fOffset: number = 32;
  @Input()
  public override set fOffset(value: number) {
    this._fOffset = value;
    this._componentDataChanged();
  }

  public override get fOffset(): number {
    return this._fOffset;
  }

  private _behavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  @Input()
  public override set fBehavior(value: EFConnectionBehavior | string) {
    this._behavior = castToEnum(value, 'fBehavior', EFConnectionBehavior);
    this._componentDataChanged();
  }

  public override get fBehavior(): EFConnectionBehavior {
    return this._behavior;
  }

  private _type: EFConnectionType = EFConnectionType.STRAIGHT;

  @Input()
  public override set fType(value: EFConnectionType | string) {
    this._type = castToEnum(value, 'fType', EFConnectionType);
    this._componentDataChanged();
  }

  public override get fType(): EFConnectionType {
    return this._type;
  }

  public override fDraggingDisabled: boolean = false;

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
    fConnectionFactory: FConnectionFactory
  ) {
    super(elementReference, fConnectionFactory);
  }

  public ngOnInit(): void {
    this._fMediator.send(new AddConnectionForCreateToStoreRequest(this));
  }

  public ngAfterViewInit(): void {
    this.hide();
  }

  public ngOnDestroy(): void {
    this._fMediator.send(new RemoveConnectionForCreateFromStoreRequest());
  }

  private _componentDataChanged(): void {
    this._fMediator.send(new ComponentsDataChangedRequest());
  }
}
