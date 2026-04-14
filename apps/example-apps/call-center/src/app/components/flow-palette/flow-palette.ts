import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { MatTooltip } from '@angular/material/tooltip';
import { NODE_PARAMS_MAP, NodeType } from '../../domain';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FlowStore } from '../../store/flow-store';

@Component({
  selector: 'flow-palette',
  templateUrl: './flow-palette.html',
  styleUrls: ['./flow-palette.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, MatTooltip, MatIcon, MatIconButton],
})
export class FlowPalette {
  private readonly _store = inject(FlowStore);

  private readonly _allItems = Object.entries(NODE_PARAMS_MAP).map(([key, data]) => ({
    ...data,
    type: key,
  }));

  protected readonly nodes = computed(() => {
    const storeNodes = this._store.nodes();
    const hasIncomingCall = storeNodes.some((n) => n.type === NodeType.INCOMING_CALL);

    return this._allItems.map((item) => ({
      ...item,
      disabled: item.type === NodeType.INCOMING_CALL && hasIncomingCall,
    }));
  });
}
