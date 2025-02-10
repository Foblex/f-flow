import {
  AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef,
  inject, Input, ViewChild,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { F_BEFORE_MAIN_PLUGIN, IFDragAndDropPlugin } from '../f-draggable';
import { MinimapDragFinalizeRequest, MinimapDragPreparationRequest } from './domain';
import { ListenTransformChangesRequest } from '../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../reactivity';
import { BrowserService } from '@foblex/platform';

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

  private _destroyRef = inject(DestroyRef);
  private _fMediator = inject(FMediator);
  private _fBrowser = inject(BrowserService);

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
    this._fMediator.execute<FChannelHub>(new ListenTransformChangesRequest()).pipe(
      notifyOnStart(), debounceTime(5)
    ).listen(this._destroyRef, () => this._redraw());
  }

  private _redraw(): void {
    if (!this._fBrowser.isBrowser()) {
      return;
    }
    this.fMinimapFlow.redraw();
    this.fMinimapView.redraw();
    this.fMinimapCanvas.redraw();
  }

  public onPointerDown(event: IPointerEvent): void {
    this._fMediator.execute(new MinimapDragPreparationRequest(event, this.fMinimapFlow.model));
  }

  public onPointerUp(event: IPointerEvent): void {
    this._fMediator.execute(new MinimapDragFinalizeRequest(event));
  }
}
