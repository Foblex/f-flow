import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule,
  injectFlowState,
  provideFFlow,
  withFlowState,
} from '@foblex/flow';
import { FToolbarComponent } from '@foblex/m-render';

interface INodeData {
  text: string;
}

@Component({
  selector: 'undo-redo-v2',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideFFlow(withFlowState())],
  imports: [FFlowModule, FToolbarComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  // The whole integration: load data in, render the signals, take data back
  // with state.snapshot() whenever you need to persist. Finished gestures
  // (create/reassign connection, node moves, deletions) are applied to the
  // state automatically, each as one undoable step.
  protected readonly state = injectFlowState<INodeData>();

  constructor() {
    this.state.load({
      nodes: [
        { id: 'node1', position: { x: 0, y: 200 }, data: { text: 'Node 1' } },
        { id: 'node2', position: { x: 200, y: 200 }, data: { text: 'Node 2' } },
      ],
      connections: [{ id: 'connection1', sourceId: 'node1-output-0', targetId: 'node2-input-1' }],
    });
  }

  protected loaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }
}
