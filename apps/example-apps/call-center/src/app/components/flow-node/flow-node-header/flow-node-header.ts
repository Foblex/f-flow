import { Component, input, model } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { MatIcon } from '@angular/material/icon';
import { NODE_PARAMS_MAP, NodeType } from '../../../domain';

@Component({
  selector: 'flow-node-header',
  templateUrl: './flow-node-header.html',
  styleUrls: ['./flow-node-header.scss'],
  standalone: true,
  imports: [FFlowModule, MatIcon],
})
export class FlowNodeHeader {
  protected readonly defaultParams = NODE_PARAMS_MAP;

  public readonly expanded = model(false);
  public readonly description = input.required<string | undefined>();
  public readonly type = input.required<NodeType>();

  protected toggle(): void {
    this.expanded.update((x) => !x);
  }
}
