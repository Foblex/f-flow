import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { IPoint, IRect, ISize, ITransformModel, RectExtensions, SizeExtensions } from '@foblex/core';
import { ILineAlignmentResult, LineService, NearestCoordinateFinder } from './domain';
import { F_LINE_ALIGNMENT, FLineAlignmentBase } from './f-line-alignment-base';
import { FComponentsStore } from '../f-storage';
import { FDraggableDataContext } from '../f-draggable';
import { FNodeBase } from '../f-node';
import { GetElementRectInFlowRequest } from '../domain';
import { FFlowMediator } from '../infrastructure';

@Component({
  selector: "f-line-alignment",
  template: "",
  styleUrls: [ "./f-line-alignment.component.scss" ],
  exportAs: "fComponent",
  host: {
    'class': 'f-line-alignment f-component'
  },
  providers: [
    { provide: F_LINE_ALIGNMENT, useExisting: FLineAlignmentComponent }
  ],
})
export class FLineAlignmentComponent extends FLineAlignmentBase implements OnInit {

  @Input()
  public fAlignThreshold: number = 10;

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  private lineService: LineService;

  private size: ISize = SizeExtensions.initialize();

  private draggedNodeRect: IRect = RectExtensions.initialize();

  private rects: IRect[] = [];

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator,
  ) {
    super();
    this.lineService = new LineService(this.hostElement);
  }

  public ngOnInit(): void {
    this.fDraggableDataContext.fLineAlignment = this;
  }

  public override initialize(allNodes: FNodeBase[], currentNodes: FNodeBase[]): void {
    this.size = this.flowHost.getBoundingClientRect();
    this.rects = [];
    const draggedNodeRects = currentNodes.map((x) => {
      return this.fMediator.send<IRect>(new GetElementRectInFlowRequest(x.hostElement));
    });
    this.draggedNodeRect = RectExtensions.union(draggedNodeRects);

    const allNodesExcludeCurrents = allNodes.filter((x) => {
      return !currentNodes.includes(x);
    });

    this.rects = allNodesExcludeCurrents.map((x) => {
      return this.fMediator.send<IRect>(new GetElementRectInFlowRequest(x.hostElement));
    });
  }

  public override handle(difference: IPoint): void {
    this.drawIntersectingLines(difference);
  }

  private drawIntersectingLines(difference: IPoint): void {
    const intersect = this.findNearestCoordinate(difference);
    if (intersect.xResult.value !== undefined) {
      this.lineService.drawVerticalLine(intersect.xResult.value, this.size, this.transform);
    } else {
      this.lineService.hideVerticalLine();
    }
    if (intersect.yResult.value !== undefined) {
      this.lineService.drawHorizontalLine(intersect.yResult.value, this.size, this.transform);
    } else {
      this.lineService.hideHorizontalLine();
    }
  }

  public findNearestCoordinate(difference: IPoint): ILineAlignmentResult {
    const rect = RectExtensions.addPoint(this.draggedNodeRect, difference);
    const finder = new NearestCoordinateFinder(this.rects, rect, this.fAlignThreshold);

    return { xResult: finder.findNearestCoordinateByX(), yResult: finder.findNearestCoordinateByY() };
  }

  public override complete(): void {
    this.lineService.hideVerticalLine();
    this.lineService.hideHorizontalLine();
  }
}
