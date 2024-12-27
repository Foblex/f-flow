import {
  AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef,
  inject, Input, ViewChild,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { F_DRAG_AND_DROP_PLUGIN, IFDragAndDropPlugin } from '../f-draggable';
import { MinimapDragFinalizeRequest, MinimapDragPreparationRequest } from './domain';
import { ListenTransformChangesRequest } from '../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../reactivity';

@Component({
  selector: 'f-minimap',
  templateUrl: './f-minimap.component.html',
  styleUrls: [ './f-minimap.component.scss' ],
  exportAs: 'fComponent',
  host: {
    'class': 'f-component f-minimap',
  },
  providers: [
    { provide: F_DRAG_AND_DROP_PLUGIN, useExisting: FMinimapComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FMinimapComponent implements AfterViewInit, IFDragAndDropPlugin {

  private _destroyRef = inject(DestroyRef);
  private _fMediator = inject(FMediator);

  @ViewChild(FMinimapCanvasDirective, { static: true })
  public fMinimapCanvas!: FMinimapCanvasDirective;

  @ViewChild(FMinimapFlowDirective, { static: true })
  public fMinimapFlow!: FMinimapFlowDirective;

  @ViewChild(FMinimapViewDirective, { static: true })
  public fMinimapView!: FMinimapViewDirective;

  @Input()
  public fMinSize: number = 1000;

  public ngAfterViewInit(): void {
    this._listenTransformChanges();
  }

  private _listenTransformChanges(): void {
    this._fMediator.send<FChannelHub>(new ListenTransformChangesRequest()).pipe(
      notifyOnStart(), debounceTime(5)
    ).listen(this._destroyRef, () => this._redraw());
  }

  private _redraw(): void {
    this.fMinimapFlow.update();
    this.fMinimapView.update();
    this.fMinimapCanvas.redraw();
  }

  public onPointerDown(event: IPointerEvent): void {
    this._fMediator.send(new MinimapDragPreparationRequest(event, this.fMinimapFlow.model));
  }

  public onPointerUp(event: IPointerEvent): void {
    this._fMediator.send(new MinimapDragFinalizeRequest(event));
  }
}
