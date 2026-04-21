import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { FFlowComponent, FFlowModule } from '@foblex/flow';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroNode } from './models/hero-node';
import { HeroWrapperNode } from './components';
import { HERO_FLOW } from './mock/mock';
import { DOCUMENT } from '@angular/common';
import { HeroConnectionStyle } from './enums/hero-connection-style';

/**
 * Anchor width used on mobile (<640px) — see hero-flow-anchor.scss.
 * The mobile layout shows the flow full-width behind the hero copy
 * without the desktop zoom boost; we branch on this value instead of
 * reading the media query so the flow stays in sync with the anchor.
 */
const MOBILE_ANCHOR_WIDTH = 280;

/**
 * On tablet + desktop the anchor is larger and the nodes get more
 * breathing room — zoom past the pure-fit scale so the node cluster
 * dominates the hero frame instead of being a tiny diagram in the
 * middle.
 */
const DESKTOP_SCALE_BOOST = 1.5;

@Component({
  selector: 'hero-flow',
  templateUrl: './hero-flow.html',
  styleUrl: './hero-flow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroWrapperNode],
})
export class HeroFlow {
  private readonly _document = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);

  private readonly _flow = viewChild(FFlowComponent);

  protected readonly nodes = HERO_FLOW.nodes;
  protected readonly connections = HERO_FLOW.connections;
  protected readonly canvasPosition = signal(PointExtensions.initialize());
  protected readonly scale = signal(1);
  protected readonly isBrowser = signal(false);

  protected readonly connectionStyle = HeroConnectionStyle;

  private _isDragging = false;

  constructor() {
    afterNextRender(
      () => {
        this.isBrowser.set(true);
        this._listenWindowResize();
      },
      { injector: this._injector },
    );
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
      scale,
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

    const fitScale = Math.min(safeWidth / width, safeHeight / height, 1);
    const isMobileAnchor = heroImageRect.width === MOBILE_ANCHOR_WIDTH;

    return isMobileAnchor ? fitScale : fitScale * DESKTOP_SCALE_BOOST;
  }

  private _getHeroImage(): HTMLElement | null {
    return this._document.querySelector('#hero-flow-anchor-container') as HTMLElement | null;
  }

  private _calculateHeroImageRect(): IRect {
    const element = this._getHeroImage();

    return element ? RectExtensions.fromElement(element) : RectExtensions.initialize();
  }

  /**
   * Places the node cluster centered on the anchor rect. The anchor
   * lives inside the hero section and shifts between the right-hand
   * column on desktop and a stacked-on-top block on mobile, so the
   * flow follows it automatically through CSS. The 2% x/y nudge
   * compensates for the asymmetric node layout (a few nodes reach
   * further right/down than the geometric center) so the visual
   * cluster lands on the anchor instead of its bounding-box center.
   */
  private _calculateCanvasPosition(nodesRect: IRect, heroImageRect: IRect, scale: number): IPoint {
    return PointExtensions.initialize(
      heroImageRect.gravityCenter.x -
        nodesRect.gravityCenter.x * scale +
        heroImageRect.width * 0.02,
      heroImageRect.gravityCenter.y -
        nodesRect.gravityCenter.y * scale +
        heroImageRect.height * 0.02,
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
