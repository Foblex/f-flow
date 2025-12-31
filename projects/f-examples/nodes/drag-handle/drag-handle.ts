import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FMoveNodesEvent } from '@foblex/flow';
import { IPoint } from '@foblex/2d';

@Component({
  selector: 'drag-handle',
  styleUrls: ['./drag-handle.scss'],
  templateUrl: './drag-handle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class DragHandle {
  private readonly _canvas = viewChild(FCanvasComponent);

  /**
   * Triggered after the <f-flow> component is fully loaded.
   * Resets the canvas scale and centers the view without animation.
   */
  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  /**
   * Called when one or more nodes are moved.
   * Can be used to track movements or persist state.
   *
   * @param event - Node movement event containing affected nodes and delta.
   */
  protected moveNodes(event: FMoveNodesEvent): void {
    // Handle node movement.
  }

  /**
   * Called when a single node's position changes.
   *
   * @param position - The new position of the node.
   */
  protected positionChanged(position: IPoint): void {
    // Handle node position change.
  }
}
