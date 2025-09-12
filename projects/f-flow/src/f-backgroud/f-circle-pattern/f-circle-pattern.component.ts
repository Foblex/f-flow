import {
  ChangeDetectionStrategy,
  Component, DestroyRef,
  ElementRef, inject, input, Input, numberAttribute, OnChanges, OnDestroy,
  OnInit, SimpleChanges,
} from "@angular/core";
import {
  IPoint,
  ITransformModel,
  PointExtensions,
  TransformModelExtensions,
} from '@foblex/2d';
import { F_BACKGROUND_PATTERN, IFBackgroundPattern } from '../domain';
import { BrowserService } from '@foblex/platform';
import { createSVGElement } from '../../domain';
import { FChannel, FChannelHub, notifyOnStart } from '../../reactivity';

let uniqueId = 0;

@Component({
  selector: "f-circle-pattern",
  template: ``,
  standalone: true,
  host: {
    '[attr.id]': 'id',
  },
  providers: [
    { provide: F_BACKGROUND_PATTERN, useExisting: FCirclePatternComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCirclePatternComponent implements OnInit, OnChanges, IFBackgroundPattern {

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _elementReference = inject(ElementRef);
  private readonly _fBrowser = inject(BrowserService);

  private readonly _stateChanges = new FChannel();

  public get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public id = input<string>(`f-pattern-${ uniqueId++ }`);
  public color = input<string>('rgba(0,0,0,0.1)');
  public radius = input<number, unknown>(20, { transform: numberAttribute });

  private _scaledRadius: number = 20;

  private _transform: ITransformModel = TransformModelExtensions.default();

  private _position: IPoint = PointExtensions.initialize();

  private _pattern!: SVGPatternElement;
  private _circle!: SVGCircleElement;

  constructor(
  ) {
    this._createPattern();
  }

  private _createPattern(): void {
    this._pattern = createSVGElement('pattern', this._fBrowser);
    this._pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    this.hostElement.appendChild(this._pattern);

    this._circle = createSVGElement('circle', this._fBrowser);
    this._pattern.appendChild(this._circle);
  }

  public ngOnInit(): void {
    this._listenStateChanges();
  }

  private _listenStateChanges(): void {
    new FChannelHub(this._stateChanges).pipe(notifyOnStart()).listen(this._destroyRef, () => this._redraw());
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['radius'] || changes['color']) {
      this._refresh();
    }
  }

  private _redraw(): void {
    this._calculatePattern();
    this._redrawPattern();
    this._redrawElement();
  }

  private _calculatePattern(): void {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._scaledRadius = this.radius() * this._transform.scale;
  }

  private _redrawPattern(): void {
    this._pattern.setAttribute('x', `${ this._position.x }`);
    this._pattern.setAttribute('y', `${ this._position.y }`);
    this._pattern.setAttribute('width', `${ this._scaledRadius }`);
    this._pattern.setAttribute('height', `${ this._scaledRadius }`);
  }

  private _redrawElement(): void {
    this._circle.setAttribute('fill', this.color());
    this._circle.setAttribute('cx', `${ this._scaledRadius / 2 }`);
    this._circle.setAttribute('cy', `${ this._scaledRadius / 2 }`);
    this._circle.setAttribute('r', `${ this._scaledRadius / this.radius() }`);
  }

  public setTransform(transform: ITransformModel): void {
    this._transform = transform;
    this._refresh();
  }

  private _refresh(): void {
    this._stateChanges.notify();
  }
}
