import {
  ChangeDetectionStrategy,
  Component, DestroyRef,
  ElementRef, inject, Input, OnChanges,
  OnInit, SimpleChanges
} from "@angular/core";
import {
  IPoint, ISize, ITransformModel,
  PointExtensions, SizeExtensions, TransformModelExtensions
} from '@foblex/2d';
import { F_BACKGROUND_PATTERN, IFBackgroundPattern } from '../domain';
import { createSVGElement } from '../../domain';
import { BrowserService } from '@foblex/platform';
import { FChannel, FChannelHub, notifyOnStart } from '../../reactivity';

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
export class FRectPatternComponent implements OnInit, OnChanges, IFBackgroundPattern {

  private _destroyRef = inject(DestroyRef);

  private _elementReference = inject(ElementRef);

  private _stateChanges = new FChannel();

  public get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @Input()
  public id: string = `f-pattern-${ uniqueId++ }`;

  @Input()
  public vColor: string = 'rgba(0,0,0,0.1)';

  @Input()
  public hColor: string = 'rgba(0,0,0,0.1)';

  @Input()
  public vSize: number = 20;

  @Input()
  public hSize: number = 20;

  private _transform: ITransformModel = TransformModelExtensions.default();

  private _position: IPoint = PointExtensions.initialize();

  private _size: ISize = SizeExtensions.initialize(this.hSize, this.vSize);

  private _pattern!: SVGPatternElement;
  private _vLine!: SVGLineElement;
  private _hLine!: SVGLineElement;

  constructor(
    private _fBrowser: BrowserService
  ) {
    this._createPattern();
  }

  private _createPattern(): void {
    this._pattern = createSVGElement('pattern', this._fBrowser);
    this._pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    this.hostElement.appendChild(this._pattern);

    this._vLine = createSVGElement('line', this._fBrowser);
    this._pattern.appendChild(this._vLine);

    this._hLine = createSVGElement('line', this._fBrowser);
    this._pattern.appendChild(this._hLine);
  }

  public ngOnInit(): void {
    this._listenStateChanges();
  }

  private _listenStateChanges(): void {
    new FChannelHub(this._stateChanges).pipe(notifyOnStart()).listen(this._destroyRef, () => this._redraw());
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['vSize'] || changes['hSize'] || changes['vColor'] || changes['hColor']) {
      this._refresh();
    }
  }

  private _redraw(): void {
    this._calculatePattern();
    this._redrawPattern();

    this.redrawLine(this._vLine, this.vColor, this._size.width, 0, this._size.width, this._size.height);
    this.redrawLine(this._hLine, this.hColor, 0, this._size.height, this._size.width, this._size.height);
  }

  private _calculatePattern(): void {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._size = SizeExtensions.initialize(this.hSize * this._transform.scale, this.vSize * this._transform.scale);
  }

  private _redrawPattern(): void {
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
    this._refresh();
  }

  private _refresh(): void {
    this._stateChanges.notify();
  }
}
