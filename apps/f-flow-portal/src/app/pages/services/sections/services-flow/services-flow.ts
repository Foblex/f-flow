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
import { DOCUMENT } from '@angular/common';
import { ServiceNode } from './models/service-node';
import { ServiceWrapperNode } from './components';
import { SERVICES_FLOW } from './mock/mock';

const MOBILE_ANCHOR_WIDTH = 280;
const DESKTOP_SCALE_BOOST = 1.0;

@Component({
  selector: 'services-flow',
  templateUrl: './services-flow.html',
  styleUrl: './services-flow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, ServiceWrapperNode],
})
export class ServicesFlow {
  private readonly _document = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);

  private readonly _flow = viewChild(FFlowComponent);

  protected readonly nodes = SERVICES_FLOW.nodes;
  protected readonly connections = SERVICES_FLOW.connections;
  protected readonly canvasPosition = signal(PointExtensions.initialize());
  protected readonly scale = signal(1);
  /**
   * Flips from `false` → `true` inside `afterNextRender`, which fires
   * only on the browser. Template `@if (isBrowser())` re-evaluates on
   * the flip and the flow renders both on SPA nav and hard reload.
   */
  protected readonly isBrowser = signal(false);

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
    const anchorRect = this._calculateAnchorRect();
    const scale = this._calculateScale(nodesRect, anchorRect);
    const newCanvasPosition = this._calculateCanvasPosition(nodesRect, anchorRect, scale);

    return {
      position: newCanvasPosition,
      scaledPosition: PointExtensions.initialize(),
      scale,
      rotate: 0,
    };
  }

  private _calculateScale(nodesRect: IRect, anchorRect: IRect): number {
    const safeWidth = anchorRect.width * 1.2;
    const safeHeight = anchorRect.height * 1.2;
    const width = Math.max(nodesRect.width, 1);
    const height = Math.max(nodesRect.height, 1);

    if (!safeWidth || !safeHeight) {
      return 1;
    }

    const fitScale = Math.min(safeWidth / width, safeHeight / height, 1);
    const isMobileAnchor = anchorRect.width === MOBILE_ANCHOR_WIDTH;

    return isMobileAnchor ? fitScale : fitScale * DESKTOP_SCALE_BOOST;
  }

  private _getAnchor(): HTMLElement | null {
    return this._document.querySelector('#services-flow-anchor-container') as HTMLElement | null;
  }

  private _calculateAnchorRect(): IRect {
    const element = this._getAnchor();

    return element ? RectExtensions.fromElement(element) : RectExtensions.initialize();
  }

  private _calculateCanvasPosition(nodesRect: IRect, anchorRect: IRect, scale: number): IPoint {
    return PointExtensions.initialize(
      anchorRect.gravityCenter.x - nodesRect.gravityCenter.x * scale,
      anchorRect.gravityCenter.y - nodesRect.gravityCenter.y * scale,
    );
  }

  protected changeNodePosition(point: IPoint, node: ServiceNode): void {
    node.position = point;
  }

  protected dragStarted(): void {
    this._isDragging = true;
  }

  protected dragEnded(): void {
    this._isDragging = false;
  }
}
