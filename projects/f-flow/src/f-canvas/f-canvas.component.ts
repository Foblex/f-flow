import {
  ChangeDetectionStrategy,
  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,
} from "@angular/core";
import {
  FCanvasBase, F_CANVAS
} from './f-canvas-base';
import { IPoint, IRect, Point, PointExtensions, RectExtensions, TransformModelExtensions } from '@foblex/core';
import { FCanvasChangeEvent } from './domain';
import { FComponentsStore } from '../f-storage';
import { FNodeBase } from '../f-node';
import { FFlowMediator } from '../infrastructure';
import { GetNodesRectRequest } from '../domain';

@Component({
  selector: 'f-canvas',
  templateUrl: './f-canvas.component.html',
  styleUrls: [ './f-canvas.component.scss' ],
  exportAs: 'fComponent',
  host: {
    'class': 'f-component f-canvas',
  },
  providers: [ { provide: F_CANVAS, useExisting: FCanvasComponent } ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCanvasComponent extends FCanvasBase implements OnInit {

  @Output()
  public override fCanvasChange: EventEmitter<FCanvasChangeEvent> = new EventEmitter<FCanvasChangeEvent>();

  @Input()
  public set position(value: IPoint | undefined) {
    if (!value) {
      return;
    }
    const position = PointExtensions.sum(this.transform.position, this.transform.scaledPosition);
    if (!PointExtensions.isEqual(position, value)) {
      this.transform.position = value;
      this.transform.scaledPosition = PointExtensions.initialize();
      this.redraw();
    }
  }

  @Input()
  public set scale(value: number | undefined) {
    if (!value) {
      return;
    }
    this.transform.scale = value;
    this.redraw();
  }

  public override get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @ViewChild('fNodesContainer', { static: true })
  public override fNodesContainer!: ElementRef<HTMLElement>;

  @ViewChild('fConnectionsContainer', { static: true })
  public override fConnectionsContainer!: ElementRef<HTMLElement>;

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fMediator: FFlowMediator,
    private fComponentsStore: FComponentsStore
  ) {
    super();
  }

  public ngOnInit() {
    this.fComponentsStore.fCanvas = this;
  }

  public override redraw(): void {
    this.fComponentsStore.fBackground?.setTransform(this.transform);
    this.hostElement.setAttribute("style", `transform: ${ TransformModelExtensions.toString(this.transform) }`);
  }

  public override redrawWithAnimation(): void {
    this.fComponentsStore.fBackground?.setTransform(this.transform);
    this.hostElement.setAttribute("style", `transition: transform 0.15s ease-in-out; transform: ${ TransformModelExtensions.toString(this.transform) }`);
    setTimeout(() => {
      this.redraw();
    }, 150);
  }

  public fitToScreen(toCenter: IPoint = PointExtensions.initialize(), animated: boolean = true): void {
    const fNodesRect = this.fMediator.send<IRect>(new GetNodesRectRequest());
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }

    this.fitToParent(
      fNodesRect,
      RectExtensions.fromElement(this.fComponentsStore.fFlow!.hostElement),
      this.fNodes.map((x) => {
        return Point.fromPoint(x.position)
      }),
      toCenter
    );
    animated ? this.redrawWithAnimation() : this.redraw();
    this.completeDrag();
  }

  public oneToOne(): void {
    const fNodesRect = this.fMediator.send<IRect>(new GetNodesRectRequest());
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }
    this.oneToOneCentering(
      fNodesRect,
      RectExtensions.fromElement(this.fComponentsStore.fFlow!.hostElement),
      this.fNodes.map((x) => {
        return Point.fromPoint(x.position)
      })
    );
    this.redrawWithAnimation();
    this.completeDrag();
  }
}
