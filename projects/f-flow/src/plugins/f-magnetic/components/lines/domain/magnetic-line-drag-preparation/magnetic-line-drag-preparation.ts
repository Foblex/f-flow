import { inject, Injectable } from '@angular/core';
import { IRect, ISize, ITransformModel } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { MagneticLineDragPreparationRequest } from './magnetic-line-drag-preparation-request';
import { FComponentsStore } from '../../../../../../f-storage';
import { FDraggableDataContext } from '../../../../../../f-draggable';
import { F_MAGNETIC_LINES, FMagneticLinesBase } from '../f-magnetic-lines-base';
import { GetNormalizedElementRectRequest } from '../../../../../../domain';
import { FNodeBase } from '../../../../../../f-node';
import { MagneticLinesRenderer, MagneticLinesScheduleRenderer } from '../lines-render';

@Injectable()
@FExecutionRegister(MagneticLineDragPreparationRequest)
export class MagneticLineDragPreparation
  implements IExecution<MagneticLineDragPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _transform(): ITransformModel {
    return this._store.fCanvas?.transform as ITransformModel;
  }

  private _renderer: MagneticLinesRenderer | undefined;

  public handle(_request: MagneticLineDragPreparationRequest): void {
    if (!this._isDragContextHasMoveNode()) {
      return;
    }

    const instance = this._getMagneticLinesInstance();
    this._renderer = this._renderer || this._createRenderer(instance);

    const scheduleRenderer = new MagneticLinesScheduleRenderer(
      instance.threshold(),
      this._transform,
      this._renderer,
      this._store.flowHost.getBoundingClientRect() as ISize,
      this._collectNotDraggedNodeRects(this._allDraggedNodes(handler)),
    );
  }

  private _isDragContextHasMoveNode(): boolean {
    return this._dragContext.draggableItems.some((x) => x.fEventType === 'move-node');
  }

  private _getMagneticLinesInstance(): FMagneticLinesBase {
    return this._store.fComponents[F_MAGNETIC_LINES.toString()] as FMagneticLinesBase;
  }

  private _createRenderer(instance: FMagneticLinesBase): MagneticLinesRenderer {
    return new MagneticLinesRenderer(this._browser, instance.hostElement);
  }

  private _allDraggedNodes(handler: {
    allDraggedNodeHandlers: { nodeOrGroup: FNodeBase }[];
  }): FNodeBase[] {
    return handler.allDraggedNodeHandlers.map((x) => x.nodeOrGroup);
  }

  private _collectNotDraggedNodeRects(allDraggedNodes: FNodeBase[]): IRect[] {
    return this._calculateNotDraggedNodes(allDraggedNodes).map((x) => {
      return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement));
    });
  }

  private _calculateNotDraggedNodes(draggedNodes: FNodeBase[]): FNodeBase[] {
    return this._store.fNodes.filter((x) => !draggedNodes.includes(x));
  }
}
