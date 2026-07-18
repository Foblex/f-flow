import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EFConnectableSide, EFLayoutDirection, FFlowModule } from '@foblex/flow';
import { CAMPAIGN_NODE_METADATA, CampaignNodeRecord, ECampaignNodeType } from '../../domain';

@Component({
  selector: 'campaign-node',
  standalone: true,
  imports: [FFlowModule, MatIcon],
  templateUrl: './campaign-node.html',
  styleUrls: ['./campaign-node.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-node-type]': 'node().type',
    '[class.node-inactive]': '!node().isActive',
  },
})
export class CampaignNode {
  public readonly node = input.required<CampaignNodeRecord>();
  public readonly direction = input.required<EFLayoutDirection>();

  protected readonly metadata = computed(() => CAMPAIGN_NODE_METADATA[this.node().type]);
  protected readonly isTrigger = computed(() => this.node().type === ECampaignNodeType.TRIGGER);
  protected readonly isHorizontal = computed(
    () => this.direction() === EFLayoutDirection.LEFT_RIGHT,
  );
  protected readonly targetSide = computed(() =>
    this.isHorizontal() ? EFConnectableSide.LEFT : EFConnectableSide.TOP,
  );
  protected readonly sourceSide = computed(() =>
    this.isHorizontal() ? EFConnectableSide.RIGHT : EFConnectableSide.BOTTOM,
  );
}
