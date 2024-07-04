import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild
} from "@angular/core";
import {
  castToConnectionBehavior, CONNECTION_GRADIENT,
  CONNECTION_PATH, CONNECTION_TEXT,
  FConnectionBase, FConnectionDragHandleComponent, FConnectionSelectionComponent, IConnectionGradient,
  IConnectionPath, IConnectionText,
} from '../common';
import { EFConnectionBehavior } from '../common';
import { EFConnectionType } from '../common';
import { F_CONNECTION } from '../common/f-connection.injection-token';
import { FMarkerBase } from '../f-marker';
import { FConnectionCenterDirective } from '../f-connection-center';
import { FConnectionFactory } from '../f-connection-builder';
import { FComponentsStore } from '../../f-storage';

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

  public override fConnectionId: string = `f-connection-for-create-${ uniqueId++ }`;

  public override fText: string = '';

  private _fStartColor: string = 'black';
  @Input()
  public override set fStartColor(value: string) {
    this._fStartColor = value;
    this.fComponentsStore.changes.next();
  }
  public override get fStartColor(): string {
    return this._fStartColor;
  }

  private _fEndColor: string = 'black';
  @Input()
  public override set fEndColor(value: string) {
    this._fEndColor = value;
    this.fComponentsStore.changes.next();
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
    this.fComponentsStore.changes.next();
  }
  public override get fRadius(): number {
    return this._fRadius;
  }

  private _fOffset: number = 32;
  @Input()
  public override set fOffset(value: number) {
    this._fOffset = value;
    this.fComponentsStore.changes.next();
  }
  public override get fOffset(): number {
    return this._fOffset;
  }

  private _behavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;
  @Input()
  public override set fBehavior(value: EFConnectionBehavior | string) {
    this._behavior = castToConnectionBehavior(value);
    this.fComponentsStore.changes.next();
  }
  public override get fBehavior(): EFConnectionBehavior {
    return this._behavior;
  }

  private _type: EFConnectionType = EFConnectionType.STRAIGHT;
  @Input()
  public override set fType(value: EFConnectionType | string) {
    this._type = value as EFConnectionType;
    this.fComponentsStore.changes.next();
  }
  public override get fType(): EFConnectionType {
    return this._type;
  }

  public override fDraggingDisabled: boolean = false;

  public override fSelectionDisabled: boolean = false;

  @ViewChild('defs', { static: true })
  public override fDefs!: ElementRef<SVGDefsElement>;

  public get fMarkers(): FMarkerBase[] {
    return this.fComponentsStore.fMarkers.filter((x) => {
      return this.hostElement.contains(x.hostElement);
    });
  }

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

  constructor(
      elementReference: ElementRef<HTMLElement>,
      fConnectionFactory: FConnectionFactory,
      private fComponentsStore: FComponentsStore
  ) {
    super(elementReference, fConnectionFactory);
  }

  public ngOnInit(): void {
    this.fComponentsStore.fTempConnection = this;
  }

  public ngAfterViewInit(): void {
    this.hide();
  }

  public ngOnDestroy(): void {
    this.fComponentsStore.fTempConnection = undefined;
  }
}
