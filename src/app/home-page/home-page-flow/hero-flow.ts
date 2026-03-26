import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { EFMarkerType, FFlowComponent, FFlowModule } from '@foblex/flow';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { IS_BROWSER_PLATFORM } from '@foblex/m-render';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroNode } from './models/hero-node';
import { HeroWrapperNode } from './components';
import { HERO_FLOW } from './mock/mock';
import { DOCUMENT } from '@angular/common';
import { HeroConnectionStyle } from './enums/hero-connection-style';

@Component({
  selector: 'home-page-flow',
  templateUrl: './hero-flow.html',
  styleUrls: ['./hero-flow.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroWrapperNode],
})
export class HeroFlow implements OnInit {
  private readonly _document = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);
  protected readonly isBrowser = inject(IS_BROWSER_PLATFORM);

  private readonly _flow = viewChild(FFlowComponent);

  protected readonly nodes = HERO_FLOW.nodes;
  protected readonly connections = HERO_FLOW.connections;
  protected readonly canvasPosition = signal(PointExtensions.initialize());
  protected readonly scale = signal(1);

  protected readonly eMarkerType = EFMarkerType;
  protected readonly eHeroConnectionStyle = HeroConnectionStyle;

  private _isDragging = false;

  public ngOnInit(): void {
    if (this.isBrowser) {
      this._listenWindowResize();
    }
  }

  private _listenWindowResize(): void {
    fromEvent(window, 'resize')
      .pipe(startWith(null), debounceTime(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._modifyPosition());
  }

  protected loaded(): void {
    this._modifyPosition();
  }

  private _modifyPosition(): void {
    if (!this._flow() || this._isDragging) {
      return;
    }
    const { scale, position } = this._calculateNewTransform();
    this.scale.set(scale);
    this.canvasPosition.set(position);
  }

  private _calculateNewTransform(): ITransformModel {
    const nodesRect = this._flow()?.getNodesBoundingBox() || RectExtensions.initialize();

    const heroImageRect = this._calculateHeroImageRect();
    const scale = this._calculateScale(nodesRect, heroImageRect);

    const newCanvasPosition = this._calculateCanvasPosition(nodesRect, heroImageRect, scale);
    return {
      position: newCanvasPosition,
      scaledPosition: PointExtensions.initialize(),
      scale: scale,
      rotate: 0,
    };
  }

  private _calculateScale(nodesRect: IRect, heroImageRect: IRect): number {
    const safeWidth = heroImageRect.width * 1.08;
    const safeHeight = heroImageRect.height * 1.08;
    const width = Math.max(nodesRect.width, 1);
    const height = Math.max(nodesRect.height, 1);

    if (!safeWidth || !safeHeight) {
      return 1;
    }

    return heroImageRect.width === 280
      ? Math.min(safeWidth / width, safeHeight / height, 1)
      : Math.min(safeWidth / width, safeHeight / height, 1) * 1.5;
  }

  private _getHeroImage(): HTMLElement | null {
    return this._document.querySelector('#home-page-image-container') as HTMLElement | null;
  }

  private _calculateHeroImageRect(): IRect {
    const element = this._getHeroImage();
    return element ? RectExtensions.fromElement(element) : RectExtensions.initialize();
  }

  private _calculateCanvasPosition(nodesRect: IRect, heroImageRect: IRect, scale: number): IPoint {
    return PointExtensions.initialize(
      heroImageRect.gravityCenter.x -
        nodesRect.gravityCenter.x * scale +
        heroImageRect.width * 0.02 -
        (heroImageRect.width === 280 ? 0 : 0),
      heroImageRect.gravityCenter.y -
        nodesRect.gravityCenter.y * scale +
        heroImageRect.height * 0.02 +
        (heroImageRect.width === 280 ? 0 : -100 * scale),
    );
  }

  protected changeNodePosition(point: IPoint, node: HeroNode): void {
    node.position = point;
  }

  protected dragStarted(): void {
    this._isDragging = true;
  }

  protected dragEnded(): void {
    this._isDragging = false;
  }
}
