import { IPoint, IRect, ISize } from '@foblex/2d';
import { IDraggableItem } from '../../f-draggable';
import { FComponentsStore } from '../../f-storage';
import { LineService } from '../../f-line-alignment';

export class LineAlignmentDragHandler implements IDraggableItem {

  constructor(
    private _fComponentsStore: FComponentsStore,
    private _lineService: LineService,
    private _size: ISize,
    private _draggedNodeRect: IRect,
    private _rects: IRect[],
  ) {
  }

  public onPointerMove(difference: IPoint): void {
  }

  public onPointerUp(): void {
  }
}
