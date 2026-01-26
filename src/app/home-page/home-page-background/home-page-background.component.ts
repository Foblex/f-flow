import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { EFConnectionBehavior, EFMarkerType, FFlowComponent, FFlowModule } from '@foblex/flow';
import { IPoint, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { debounceTime, fromEvent, startWith, Subscription } from 'rxjs';
import { IHeroFlowNode } from './domain/i-hero-flow-node';
import { HERO_FLOW_CONFIGURATION } from './domain/hero-flow.configuration';
import { GetNewCanvasTransformHandler } from './domain/get-new-canvas-transform-handler/get-new-canvas-transform.handler';
import { GetNewCanvasTransformRequest } from './domain/get-new-canvas-transform-handler/get-new-canvas-transform.request';
import { HomePageBackgroundNodeComponent } from './home-page-background-node/home-page-background-node.component';
import { BrowserService } from '@foblex/platform';
import { IS_BROWSER_PLATFORM } from '@foblex/m-render';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'home-page-background',
  templateUrl: './home-page-background.component.html',
  styleUrls: ['./home-page-background.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HomePageBackgroundNodeComponent],
})
export class HomePageBackgroundComponent implements OnInit {
  private readonly _browser = inject(BrowserService);
  protected readonly isBrowser = inject(IS_BROWSER_PLATFORM);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _flow = viewChild(FFlowComponent);

  protected readonly nodes = HERO_FLOW_CONFIGURATION.nodes;
  protected readonly connections = HERO_FLOW_CONFIGURATION.connections;
  protected readonly canvasPosition = signal(PointExtensions.initialize());
  protected readonly scale = signal(1);

  protected readonly eMarkerType = EFMarkerType;
  protected readonly eConnectionBehaviour = EFConnectionBehavior;

  public ngOnInit(): void {
    if (this.isBrowser) {
      this._listenWindowResize();
    }
  }

  private _listenWindowResize(): Subscription {
    return fromEvent(window, 'resize')
      .pipe(startWith(null), debounceTime(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._modifyPosition());
  }

  protected loaded(): void {
    this._modifyPosition();
  }

  private _modifyPosition(): void {
    if (!this._flow()) {
      return;
    }
    const { scale, position } = this._calculateNewTransform();
    this.scale.set(scale);
    this.canvasPosition.set(position);
  }

  private _calculateNewTransform(): ITransformModel {
    return new GetNewCanvasTransformHandler(this._browser).handle(
      new GetNewCanvasTransformRequest(
        this._flow()?.getNodesBoundingBox() || RectExtensions.initialize(),
      ),
    );
  }

  protected changeNodePosition(point: IPoint, node: IHeroFlowNode): void {
    node.position = point;
  }
}
