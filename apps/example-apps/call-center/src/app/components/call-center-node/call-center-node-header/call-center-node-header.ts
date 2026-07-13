import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FFlowModule } from '@foblex/flow';
import { CALL_CENTER_NODE_METADATA, ECallCenterNodeType } from '../../../domain';

@Component({
  selector: 'call-center-node-header',
  templateUrl: './call-center-node-header.html',
  styleUrls: ['./call-center-node-header.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, MatIcon],
})
export class CallCenterNodeHeader {
  public readonly expanded = input(false);
  public readonly description = input.required<string | undefined>();
  public readonly type = input.required<ECallCenterNodeType>();
  public readonly expandedChange = output<boolean>();

  protected readonly metadata = CALL_CENTER_NODE_METADATA;

  protected toggle(): void {
    this.expandedChange.emit(!this.expanded());
  }
}
