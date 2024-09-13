import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  ElementRef, Input, OnDestroy, ViewChild,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubscribeOnTransformChangesRequest } from '../domain';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import { IPointerEvent } from '@foblex/core';
import { F_DRAG_AND_DROP_PLUGIN, IFDragAndDropPlugin } from '../f-draggable';
import { MinimapDragFinalizeRequest, MinimapDragPreparationRequest } from './domain';

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

  private subscriptions$: Subscription = new Subscription();

  @ViewChild(FMinimapCanvasDirective, { static: true })
  public fMinimapCanvas!: FMinimapCanvasDirective;

  @ViewChild(FMinimapFlowDirective, { static: true })
  public fMinimapFlow!: FMinimapFlowDirective;

  @ViewChild(FMinimapViewDirective, { static: true })
  public fMinimapView!: FMinimapViewDirective;

  @Input()
  public fMinSize: number = 1000;

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fMediator: FMediator
  ) {
  }

  public ngAfterViewInit(): void {
    this.subscriptions$.add(this.subscribeOnTransformChanges());
  }

  private subscribeOnTransformChanges(): Subscription {
    return this.getTransformChanges().pipe(debounceTime(5)).subscribe(() => {
      this.fMinimapFlow.update();
      this.fMinimapView.update();
      this.fMinimapCanvas.redraw();
    });
  }

  private getTransformChanges(): Observable<void> {
    return this.fMediator.send<Observable<void>>(new SubscribeOnTransformChangesRequest());
  }

  public onPointerDown(event: IPointerEvent): void {
    this.fMediator.send(new MinimapDragPreparationRequest(event, this.fMinimapFlow.model));
  }

  public onPointerUp(event: IPointerEvent): void {
    this.fMediator.send(new MinimapDragFinalizeRequest(event));
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
