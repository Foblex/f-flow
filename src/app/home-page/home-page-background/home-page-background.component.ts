import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnDestroy, OnInit,
  ViewChild,
} from '@angular/core';
import {
  EFConnectionBehavior,
  EFMarkerType,
  FFlowComponent, FFlowModule
} from '@foblex/flow';
import { IPoint, PointExtensions, RectExtensions } from '@foblex/2d';
import { debounceTime, fromEvent, startWith, Subscription } from 'rxjs';
import { IHeroFlowNode } from './domain/i-hero-flow-node';
import { IHeroFlowConnection } from './domain/i-hero-flow-connection';
import { HERO_FLOW_CONFIGURATION } from './domain/hero-flow.configuration';
import {
  GetNewCanvasTransformHandler
} from './domain/get-new-canvas-transform-handler/get-new-canvas-transform.handler';
import {
  GetNewCanvasTransformRequest
} from './domain/get-new-canvas-transform-handler/get-new-canvas-transform.request';
import { HomePageBackgroundNodeComponent } from './home-page-background-node/home-page-background-node.component';
import { BrowserService } from '@foblex/platform';

@Component({
  selector: 'home-page-background',
  templateUrl: './home-page-background.component.html',
  styleUrls: [ './home-page-background.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    HomePageBackgroundNodeComponent
  ]
})
export class HomePageBackgroundComponent implements OnInit, OnDestroy {

  private subscription$: Subscription = new Subscription();

  public nodes: IHeroFlowNode[] = HERO_FLOW_CONFIGURATION.nodes;

  public connections: IHeroFlowConnection[] = HERO_FLOW_CONFIGURATION.connections;

  @ViewChild(FFlowComponent, { static: false })
  public fFlowComponent!: FFlowComponent;

  public canvasPosition: IPoint = PointExtensions.initialize();

  public scale: number = 1;

  public eMarkerType = EFMarkerType;

  public eConnectionBehaviour = EFConnectionBehavior;

  public isBrowser: boolean = false;

  constructor(
    private fBrowser: BrowserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isBrowser = this.fBrowser.isBrowser();
  }

  public ngOnInit(): void {
    if (this.fBrowser.isBrowser()) {
      this.subscription$.add(this.subscribeOnWindowResize());
    }
  }

  private subscribeOnWindowResize(): Subscription {
    return fromEvent(window, 'resize').pipe(startWith(null), debounceTime(1)).subscribe(() => {
      if(this.fFlowComponent) {
        this.modifyPosition();
      }
    });
  }

  public onLoaded(): void {
    if(this.fFlowComponent) {
      this.modifyPosition();
    }
  }

  private modifyPosition(): void {
    const result = new GetNewCanvasTransformHandler(this.fBrowser).handle(
      new GetNewCanvasTransformRequest(this.fFlowComponent.getAllNodesRect() || RectExtensions.initialize())
    );
    this.scale = result.scale;
    this.canvasPosition = result.position;
    this.changeDetectorRef.markForCheck();
  }

  public onNodePositionChanged(point: IPoint, node: IHeroFlowNode): void {
    node.position = point;
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
