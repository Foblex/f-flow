import {
  ChangeDetectionStrategy,
  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,
} from "@angular/core";
import {
  FCanvasBase, F_CANVAS
} from './f-canvas-base';
import { IPoint, PointExtensions, TransformModelExtensions } from '@foblex/2d';
import {
  FCanvasChangeEvent,
} from './domain';
import { FComponentsStore } from '../f-storage';
import { FNodeBase } from '../f-node';
import { FMediator } from '@foblex/mediator';
import {
  CenterGroupOrNodeRequest,
  EmitTransformChangesRequest,
  F_CANVAS_ANIMATION_DURATION,
  FitToFlowRequest,
  InputCanvasPositionRequest,
  InputCanvasScaleRequest,
  ResetScaleAndCenterRequest, ResetScaleRequest, UpdateScaleRequest,
} from '../domain';

@Component({
  selector: 'f-canvas',
  templateUrl: './f-canvas.component.html',
  styleUrls: [ './f-canvas.component.scss' ],
  exportAs: 'fComponent',
  host: {
    'class': 'f-component f-canvas',
  },
  providers: [
    { provide: F_CANVAS, useExisting: FCanvasComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCanvasComponent extends FCanvasBase implements OnInit {

  @Output()
  public override fCanvasChange: EventEmitter<FCanvasChangeEvent> = new EventEmitter<FCanvasChangeEvent>();

  @Input()
  public set position(value: IPoint | undefined) {
    this.fMediator.send(new InputCanvasPositionRequest(this.transform, value));
  }

  @Input()
  public set scale(value: number | undefined) {
    this.fMediator.send(new InputCanvasScaleRequest(this.transform, value));
  }

  public override get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @ViewChild('fGroupsContainer', { static: true })
  public override fGroupsContainer!: ElementRef<HTMLElement>;

  @ViewChild('fNodesContainer', { static: true })
  public override fNodesContainer!: ElementRef<HTMLElement>;

  @ViewChild('fConnectionsContainer', { static: true })
  public override fConnectionsContainer!: ElementRef<HTMLElement>;

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
  ) {
    super();
  }

  public ngOnInit() {
    this.fComponentsStore.fCanvas = this;
  }

  public override redraw(): void {
    this.fComponentsStore.fBackground?.setTransform(this.transform);
    this.hostElement.setAttribute("style", `transform: ${ TransformModelExtensions.toString(this.transform) }`);
    this.fMediator.send(new EmitTransformChangesRequest());
  }

  public override redrawWithAnimation(): void {
    let duration = F_CANVAS_ANIMATION_DURATION;
    if (this.isMobile()) {
      duration = 80;
    }
    this.fComponentsStore.fBackground?.setTransform(this.transform);
    this.hostElement.setAttribute("style", `transition: transform ${ duration }ms ease-in-out; transform: ${ TransformModelExtensions.toString(this.transform) }`);
    setTimeout(() => this.redraw(), F_CANVAS_ANIMATION_DURATION);
  }

  private isMobile(): boolean {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window[ 'opera' ];
    return /android|iPad|iPhone|iPod/i.test(userAgent);
  }

  public centerGroupOrNode(id: string, animated: boolean = true): void {
    this.fMediator.send(new CenterGroupOrNodeRequest(id, animated));
  }

  public fitToScreen(toCenter: IPoint = PointExtensions.initialize(), animated: boolean = true): void {
    this.fMediator.send(new FitToFlowRequest(toCenter, animated));
  }

  public resetScaleAndCenter(animated: boolean = true): void {
    this.fMediator.send(new ResetScaleAndCenterRequest(animated));
  }

  public override setZoom(scale: number, toPosition: IPoint = PointExtensions.initialize()): void {
    this.fMediator.send(new UpdateScaleRequest(scale, toPosition));
  }

  public override resetZoom(): void {
    this.fMediator.send(new ResetScaleRequest());
  }
}
