import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input, OnDestroy,
  OnInit
} from "@angular/core";
import {
  DomElementExtensions,
  IPoint,
  ISize,
  ITransformModel,
  PointExtensions, SizeExtensions,
  TransformModelExtensions
} from '@foblex/core';
import { F_BACKGROUND_PATTERN, IFBackgroundPattern } from '../domain';
import { startWith, Subject, Subscription } from 'rxjs';

let uniqueId: number = 0;

@Component({
  selector: "f-rect-pattern",
  template: ``,
  host: {
    '[attr.id]': 'id'
  },
  providers: [
    { provide: F_BACKGROUND_PATTERN, useExisting: FRectPatternComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FRectPatternComponent implements OnInit, OnDestroy, IFBackgroundPattern {

  private _subscription$: Subscription = new Subscription();

  private _stateChanges: Subject<void> = new Subject<void>();

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @Input()
  public id: string = `f-pattern-${ uniqueId++ }`;

  private _vColor: string = 'rgba(0,0,0,0.1)';

  @Input()
  public set vColor(value: string) {
    this._vColor = value;
    this._stateChanges.next();
  }

  private _hColor: string = 'rgba(0,0,0,0.1)';

  @Input()
  public set hColor(value: string) {
    this._vColor = value;
    this._stateChanges.next();
  }

  private _vSize: number = 20;

  @Input()
  public set vSize(value: number) {
    this._vSize = value;
    this._stateChanges.next();
  }

  private _hSize: number = 20;

  @Input()
  public set hSize(value: number) {
    this._hSize = value;
    this._stateChanges.next();
  }

  private _transform: ITransformModel = TransformModelExtensions.default();

  private _position: IPoint = PointExtensions.initialize();

  private _size: ISize = SizeExtensions.initialize(this._hSize, this._vSize);

  private _pattern!: SVGPatternElement;
  private _vLine!: SVGLineElement;
  private _hLine!: SVGLineElement;

  constructor(
    private elementReference: ElementRef<HTMLElement>
  ) {
    this.createPattern();
  }

  private createPattern(): void {
    this._pattern = DomElementExtensions.createSvgElement('pattern');
    this._pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    this.hostElement.appendChild(this._pattern);

    this._vLine = DomElementExtensions.createSvgElement('line');
    this._pattern.appendChild(this._vLine);

    this._hLine = DomElementExtensions.createSvgElement('line');
    this._pattern.appendChild(this._hLine);
  }

  public ngOnInit(): void {
    this._subscription$.add(this.subscribeToStateChanges());
  }

  private subscribeToStateChanges(): Subscription {
    return this._stateChanges.pipe(startWith(null)).subscribe(() => {
      this.redraw();
    });
  }

  private calculatePattern(): void {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._size = SizeExtensions.initialize(this._hSize * this._transform.scale, this._vSize * this._transform.scale);
  }

  private redraw(): void {
    this.calculatePattern();
    this.redrawPattern();

    this.redrawLine(this._vLine, this._vColor, this._size.width, 0, this._size.width, this._size.height);
    this.redrawLine(this._hLine, this._hColor, 0, this._size.height, this._size.width, this._size.height);
  }

  private redrawPattern(): void {
    this._pattern.setAttribute('x', `${ this._position.x }`);
    this._pattern.setAttribute('y', `${ this._position.y }`);
    this._pattern.setAttribute('width', `${ this._size.width }`);
    this._pattern.setAttribute('height', `${ this._size.height }`);
  }

  private redrawLine(line: SVGLineElement, color: string, x1: number, y1: number, x2: number, y2: number): void {
    line.setAttribute('stroke', `${ color }`);
    line.setAttribute('x1', `${ x1 }`);
    line.setAttribute('x2', `${ x2 }`);
    line.setAttribute('y1', `${ y1 }`);
    line.setAttribute('y2', `${ y2 }`);
  }

  public setTransform(transform: ITransformModel): void {
    this._transform = transform;
    this._stateChanges.next();
  }

  public ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
