import {
  AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef,
  inject, Input, OnDestroy, ViewChild,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { F_DRAG_AND_DROP_PLUGIN, IFDragAndDropPlugin } from '../f-draggable';
import { MinimapDragFinalizeRequest, MinimapDragPreparationRequest } from './domain';
import { ListenTransformChangesRequest } from '../f-storage';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class FMinimapComponent implements AfterViewInit, OnDestroy, IFDragAndDropPlugin {

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
    this._subscribeOnTransformChanges();
  }

  private _subscribeOnTransformChanges(): void {
    this._getTransformChanges().pipe(debounceTime(5), takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.fMinimapFlow.update();
      this.fMinimapView.update();
      this.fMinimapCanvas.redraw();
    });
  }

  private _getTransformChanges(): Observable<void> {
    return this._fMediator.send<Observable<void>>(new ListenTransformChangesRequest());
  }

  public onPointerDown(event: IPointerEvent): void {
    this._fMediator.send(new MinimapDragPreparationRequest(event, this.fMinimapFlow.model));
  }

  public onPointerUp(event: IPointerEvent): void {
    this._fMediator.send(new MinimapDragFinalizeRequest(event));
  }

  public ngOnDestroy(): void {

  }
}
