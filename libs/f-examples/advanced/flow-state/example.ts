import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule,
  IFStateNode,
  injectFlowState,
  provideFFlow,
  withFlowState,
} from '@foblex/flow';
import { FExternalPaletteComponent, FToolbarComponent } from '@foblex/m-render';

// Your own node shape: the framework fields (id, position, …) plus whatever
// you need. No `data` wrapper — your fields live right on the record.
interface INode extends IFStateNode {
  text: string;
}

@Component({
  selector: 'flow-state',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideFFlow(withFlowState({ dropToGroup: true, canvasTransformDebounce: 350 }))],
  imports: [FFlowModule, FToolbarComponent, FExternalPaletteComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  // The whole integration: load data in, render the signals, take data back
  // with state.snapshot() whenever you need to persist. Finished gestures
  // (create/reassign connection, node moves, drop-to-group, external-item
  // drops, deletions) are applied to the state automatically, each one step.
  protected readonly state = injectFlowState<INode>();

  // Dragging one of these onto the canvas fires (fCreateNode); the state's
  // default handler turns the item's fData into a node's data — no handler
  // in this component. Drop it inside the group to parent it automatically.
  protected readonly paletteItems: { text: string }[] = [{ text: 'Task' }, { text: 'Note' }];

  constructor() {
    this.state.load({
      nodes: [
        { id: 'node1', position: { x: 40, y: 120 }, text: 'Node 1' },
        { id: 'node2', position: { x: 360, y: 120 }, text: 'Node 2' },
      ],
      groups: [{ id: 'group1', position: { x: 320, y: 40 }, size: { width: 240, height: 220 } }],
      connections: [
        { id: 'connection1', sourceId: 'node1-output-bottom', targetId: 'node2-input-left' },
      ],
    });
  }

  protected rendered(): void {
    // Initial centering is a programmatic view change, so it must not become
    // an undoable canvas event.
    this._canvas().resetScaleAndCenter(true, false);
  }
}
