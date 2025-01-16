import { AfterViewInit, Component, ElementRef, inject, Input } from '@angular/core';
import {
  findClosestAlignment,
  IPoint,
  IRect,
  ISize,
  ITransformModel,
  RectExtensions,
  SizeExtensions
} from '@foblex/2d';
import { ILineAlignmentResult, LineService } from './domain';
import { F_LINE_ALIGNMENT, FLineAlignmentBase } from './f-line-alignment-base';
import { FDraggableDataContext } from '../f-draggable';
import { FNodeBase } from '../f-node';
import { GetCanvasRequest, GetNormalizedElementRectRequest, GetFlowHostElementRequest } from '../domain';
import { FMediator } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { FCanvasBase } from '../f-canvas';

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
export class FLineAlignmentComponent extends FLineAlignmentBase implements AfterViewInit {

  private DEBOUNCE_TIME = 10;

  @Input()
  public fAlignThreshold: number = 10;

  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  private lineService: LineService;

  private size: ISize = SizeExtensions.initialize();

  private draggedNodeRect: IRect = RectExtensions.initialize();

  private rects: IRect[] = [];

  private _fMediator = inject(FMediator);

  private _fCanvas: FCanvasBase | undefined;

  private _debounceTimer: any = null;

  private get _transform(): ITransformModel {
    return this._fCanvas!.transform;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fDraggableDataContext: FDraggableDataContext,
    fBrowser: BrowserService
  ) {
    super();
    this.lineService = new LineService(fBrowser, this.hostElement);
  }

  public ngAfterViewInit(): void {
    this._fCanvas = this._fMediator.send(new GetCanvasRequest());
    this.fDraggableDataContext.fLineAlignment = this;
  }

  public override initialize(allNodes: FNodeBase[], currentNodes: FNodeBase[]): void {
    this.size = this._fMediator.send<HTMLElement>(new GetFlowHostElementRequest()).getBoundingClientRect();
    this.rects = [];
    const draggedNodeRects = currentNodes.map((x) => {
      return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    });
    this.draggedNodeRect = RectExtensions.union(draggedNodeRects) || RectExtensions.initialize();

    const allNodesExcludeCurrents = allNodes.filter((x) => {
      return !currentNodes.includes(x);
    });

    this.rects = allNodesExcludeCurrents.map((x) => {
      return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    });
  }

  public override handle(difference: IPoint): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => this.drawIntersectingLines(difference), this.DEBOUNCE_TIME);
  }

  private drawIntersectingLines(difference: IPoint): void {
    const intersect = this.findNearestCoordinate(difference);
    if (intersect.xResult.value !== undefined) {
      this.lineService.drawVerticalLine(intersect.xResult.value, this.size, this._transform);
    } else {
      this.lineService.hideVerticalLine();
    }
    if (intersect.yResult.value !== undefined) {
      this.lineService.drawHorizontalLine(intersect.yResult.value, this.size, this._transform);
    } else {
      this.lineService.hideHorizontalLine();
    }
  }

  public findNearestCoordinate(difference: IPoint): ILineAlignmentResult {
    const rect = RectExtensions.addPoint(this.draggedNodeRect, difference);

    return findClosestAlignment(this.rects, rect, this.fAlignThreshold);
  }

  public override complete(): void {
    this.lineService.hideVerticalLine();
    this.lineService.hideHorizontalLine();

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }
}
