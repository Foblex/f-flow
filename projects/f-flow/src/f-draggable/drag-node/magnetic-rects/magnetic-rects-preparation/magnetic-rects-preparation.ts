import { inject, Injectable, Injector } from '@angular/core';
import { MagneticRectsPreparationRequest } from './magnetic-rects-preparation-request';
import { IRect } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  DragNodeHandler,
  DragNodeItemHandler,
  MagneticRectsHandler,
  MagneticRectsRenderer,
} from '../../index';
import { BrowserService } from '@foblex/platform';
import { FComponentsStore, INSTANCES } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FNodeBase } from '../../../../f-node';
import { GetNormalizedElementRectRequest } from '../../../../domain';
import { FMagneticRectsBase } from '../../../../f-magnetic-rects';

@Injectable()
@FExecutionRegister(MagneticRectsPreparationRequest)
export class MagneticRectsPreparation implements IExecution<MagneticRectsPreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);
  private readonly _injector = inject(Injector);
  private readonly _dragSession = inject(FDraggableDataContext);

  private _renderer: MagneticRectsRenderer | undefined;

  public handle(_: MagneticRectsPreparationRequest): void {
    const magneticRects = this._store.instances.get(INSTANCES.MAGNETIC_RECTS);
    if (!magneticRects) {
      return;
    }

    const handler = this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);
    if (!handler) {
      return;
    }

    handler.setMagneticRects(
      new MagneticRectsHandler(
        this._injector,
        this._getRenderer(magneticRects),
        this._notDraggedRects(this._draggedNodes(handler.items)),
      ),
    );
  }

  private _draggedNodes(items: DragNodeItemHandler[]): FNodeBase[] {
    return items.map((x) => x.nodeOrGroup);
  }

  private _getRenderer(instance: FMagneticRectsBase): MagneticRectsRenderer {
    if (!this._renderer) {
      this._renderer = new MagneticRectsRenderer(this._browser, instance.hostElement);
    }
    this._renderer?.destroy();

    return this._renderer;
  }

  private _notDraggedRects(draggedNodes: FNodeBase[]): IRect[] {
    const dragged = new Set(draggedNodes);
    const notDragged = this._store.nodes.getAll().filter((x) => !dragged.has(x));

    return notDragged.map((x) =>
      this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement)),
    );
  }
}
