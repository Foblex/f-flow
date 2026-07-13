import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FFlowModule } from '@foblex/flow';
import { CALL_CENTER_NODE_METADATA, ECallCenterNodeType } from '../../domain';
import { CallCenterFlowState } from '../../state';

@Component({
  selector: 'call-center-node-palette',
  templateUrl: './call-center-node-palette.html',
  styleUrls: ['./call-center-node-palette.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, MatTooltip, MatIcon, MatIconButton],
})
export class CallCenterNodePalette {
  private readonly _state = inject(CallCenterFlowState);
  private readonly _nodeTypes = Object.values(ECallCenterNodeType);

  protected readonly items = computed(() => {
    const hasIncomingCall = this._state
      .nodes()
      .some((node) => node.type === ECallCenterNodeType.INCOMING_CALL);

    return this._nodeTypes.map((type) => ({
      ...CALL_CENTER_NODE_METADATA[type],
      type,
      disabled: type === ECallCenterNodeType.INCOMING_CALL && hasIncomingCall,
    }));
  });
}
