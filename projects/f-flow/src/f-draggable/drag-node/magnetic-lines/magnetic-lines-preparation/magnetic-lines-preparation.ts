import { inject, Injectable, Injector } from '@angular/core';
import { MagneticLinesPreparationRequest } from './magnetic-lines-preparation-request';
import { IRect, ISize } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  DragNodeHandler,
  DragNodeItemHandler,
  MagneticLineRenderer,
  MagneticLinesHandler,
} from '../../index';
import { BrowserService } from '@foblex/platform';
import { FComponentsStore, INSTANCES } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FLineAlignmentBase } from '../../../../f-line-alignment';
import { FNodeBase } from '../../../../f-node';
import { GetNormalizedElementRectRequest } from '../../../../domain';

@Injectable()
@FExecutionRegister(MagneticLinesPreparationRequest)
export class MagneticLinesPreparation implements IExecution<MagneticLinesPreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);
  private readonly _injector = inject(Injector);
  private readonly _dragSession = inject(FDraggableDataContext);

  private _renderer: MagneticLineRenderer | undefined;

  public handle(_: MagneticLinesPreparationRequest): void {
    const magneticLines = this._store.instances.get(INSTANCES.MAGNETIC_LINES);
    if (!magneticLines) {
      return;
    }

    const handler = this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);
    if (!handler) {
      return;
    }

    handler.setMagneticLines(
      new MagneticLinesHandler(
        this._injector,
        this._renderer ?? this._createRenderer(magneticLines),
        this._flowHostSize(),
        this._notDraggedRects(this._draggedNodes(handler.items)),
      ),
    );
  }

  private _draggedNodes(items: DragNodeItemHandler[]): FNodeBase[] {
    return items.map((x) => x.nodeOrGroup);
  }

  private _flowHostSize(): ISize {
    return this._store.flowHost.getBoundingClientRect();
  }

  private _createRenderer({ hostElement }: FLineAlignmentBase): MagneticLineRenderer {
    this._renderer = new MagneticLineRenderer(this._browser, hostElement);

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
