import {
  AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef,
  inject, input, viewChild,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import { F_BEFORE_MAIN_PLUGIN, IFDragAndDropPlugin } from '../f-draggable';
import { MinimapDragFinalizeRequest, MinimapDragPreparationRequest } from './domain';
import { ListenTransformChangesRequest } from '../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../reactivity';
import { BrowserService } from '@foblex/platform';
import { IPointerEvent } from "../drag-toolkit";

@Component({
  selector: 'f-minimap',
  templateUrl: './f-minimap.component.html',
  styleUrls: [ './f-minimap.component.scss' ],
  exportAs: 'fComponent',
  host: {
    'class': 'f-component f-minimap',
  },
  providers: [
    { provide: F_BEFORE_MAIN_PLUGIN, useExisting: FMinimapComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FMinimapComponent implements AfterViewInit, IFDragAndDropPlugin {

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);

  public readonly _canvas= viewChild.required(FMinimapCanvasDirective);
  public readonly _flow = viewChild.required(FMinimapFlowDirective);
  public readonly _minimapView= viewChild.required(FMinimapViewDirective);

  public readonly fMinSize = input<number>(1000);

  public ngAfterViewInit(): void {
    this._listenTransformChanges();
  }

  private _listenTransformChanges(): void {
    this._mediator.execute<FChannelHub>(new ListenTransformChangesRequest()).pipe(
      notifyOnStart(), debounceTime(2),
    ).listen(this._destroyRef, () => {
      this._redraw()
    });
  }

  private _redraw(): void {
    if (!this._browser.isBrowser()) {
      return;
    }
    this._flow().redraw();
    this._minimapView().redraw();
    this._canvas().redraw();
  }

  public onPointerDown(event: IPointerEvent): void {
    this._mediator.execute(new MinimapDragPreparationRequest(event, this._flow().model));
  }

  public onPointerUp(event: IPointerEvent): void {
    this._mediator.execute(new MinimapDragFinalizeRequest(event));
  }
}
