import {
  ChangeDetectionStrategy,
  Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild,
} from "@angular/core";
import {
  FCanvasBase, F_CANVAS
} from './f-canvas-base';
import { IPoint, PointExtensions, TransformModelExtensions } from '@foblex/2d';
import {
  FCanvasChangeEvent,
} from './domain';
import { FMediator } from '@foblex/mediator';
import {
  AddCanvasToStoreRequest,
  CenterGroupOrNodeRequest,
  FitToFlowRequest,
  InputCanvasPositionRequest,
  InputCanvasScaleRequest, isMobile, RemoveCanvasFromStoreRequest,
  ResetScaleAndCenterRequest, ResetScaleRequest, SetBackgroundTransformRequest, transitionEnd, UpdateScaleRequest,
} from '../domain';
import { NotifyTransformChangedRequest } from '../f-storage';
import { Deprecated } from '../domain';

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
export class FCanvasComponent extends FCanvasBase implements OnInit, OnDestroy {

  private _elementReference = inject(ElementRef);

  @Output()
  public override fCanvasChange: EventEmitter<FCanvasChangeEvent> = new EventEmitter<FCanvasChangeEvent>();

  @Input()
  public set position(value: IPoint | undefined) {
    this._fMediator.send(new InputCanvasPositionRequest(this.transform, value));
  }

  @Input()
  public set scale(value: number | undefined) {
    this._fMediator.send(new InputCanvasScaleRequest(this.transform, value));
  }

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  @ViewChild('fGroupsContainer', { static: true })
  public override fGroupsContainer!: ElementRef<HTMLElement>;

  @ViewChild('fNodesContainer', { static: true })
  public override fNodesContainer!: ElementRef<HTMLElement>;

  @ViewChild('fConnectionsContainer', { static: true })
  public override fConnectionsContainer!: ElementRef<HTMLElement>;

  private _fMediator = inject(FMediator);

  public ngOnInit() {
    this._fMediator.send(new AddCanvasToStoreRequest(this));
  }

  public override redraw(): void {
    this._fMediator.send(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.setAttribute("style", `transform: ${ TransformModelExtensions.toString(this.transform) }`);
    this._fMediator.send(new NotifyTransformChangedRequest());
  }

  public override redrawWithAnimation(): void {
    this._fMediator.send(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.setAttribute("style", `transition: transform ${ isMobile() ? 80 : 150 }ms ease-in-out; transform: ${ TransformModelExtensions.toString(this.transform) }`);
    transitionEnd(this.hostElement, () => this.redraw());
  }

  public centerGroupOrNode(id: string, animated: boolean = true): void {
    this._fMediator.send(new CenterGroupOrNodeRequest(id, animated));
  }

  public fitToScreen(toCenter: IPoint = PointExtensions.initialize(), animated: boolean = true): void {
    this._fMediator.send(new FitToFlowRequest(toCenter, animated));
  }

  public resetScaleAndCenter(animated: boolean = true): void {
    this._fMediator.send(new ResetScaleAndCenterRequest(animated));
  }

  public getScale(): number {
    return this.transform.scale || 1;
  }

  /**
   *  @deprecated Method "setZoom" is deprecated. Use "setScale" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('setScale')
  public setZoom(scale: number, toPosition: IPoint = PointExtensions.initialize()): void {
    this.setScale(scale, toPosition);
  }
  public override setScale(scale: number, toPosition: IPoint = PointExtensions.initialize()): void {
    this._fMediator.send(new UpdateScaleRequest(scale, toPosition));
  }

  /**
   *  @deprecated Method "resetZoom" is deprecated. Use "resetScale" instead. This method will be removed in version 18.0.0.`,
   */
  @Deprecated('resetScale')
  public resetZoom(): void {
    this.resetScale();
  }
  public override resetScale(): void {
    this._fMediator.send(new ResetScaleRequest());
  }

  public ngOnDestroy(): void {
    this._fMediator.send(new RemoveCanvasFromStoreRequest());
  }
}
