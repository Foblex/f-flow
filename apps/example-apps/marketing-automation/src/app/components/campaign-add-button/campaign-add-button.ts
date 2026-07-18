import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import {
  CAMPAIGN_ADDABLE_NODE_TYPES,
  CAMPAIGN_NODE_GROUPS,
  CAMPAIGN_NODE_METADATA,
  CampaignAddContext,
  CampaignNodeGroup,
  ECampaignNodeType,
} from '../../domain';

interface ICampaignStepGroup {
  name: CampaignNodeGroup;
  types: ECampaignNodeType[];
}

@Component({
  selector: 'campaign-add-button',
  standalone: true,
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, FFlowModule, MatIcon, MatTooltip],
  templateUrl: './campaign-add-button.html',
  styleUrls: ['./campaign-add-button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.menu-open]': 'isOpen()',
  },
})
export class CampaignAddButton {
  public readonly nodeId = input<string | null>(null);
  public readonly context = input.required<CampaignAddContext>();
  public readonly targetConnectorId = input<string | null>(null);
  public readonly targetSide = input(EFConnectableSide.TOP);
  public readonly stepSelected = output<ECampaignNodeType>();

  protected readonly metadata = CAMPAIGN_NODE_METADATA;
  protected readonly isOpen = signal(false);
  protected readonly query = signal('');
  protected readonly positions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 10,
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -10,
    },
    {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 10,
    },
  ];

  protected readonly ariaLabel = computed(() => {
    const context = this.context();

    return context.kind === 'connection'
      ? 'Add a campaign step between connected steps'
      : `Add a campaign step${context.outputLabel ? ` to the ${context.outputLabel} branch` : ''}`;
  });

  protected readonly groups = computed<ICampaignStepGroup[]>(() => {
    const query = this.query().trim().toLowerCase();
    const available = CAMPAIGN_ADDABLE_NODE_TYPES.filter((type) => {
      const metadata = CAMPAIGN_NODE_METADATA[type];
      if (this.context().kind === 'connection' && metadata.terminal) {
        return false;
      }

      return (
        !query ||
        metadata.name.toLowerCase().includes(query) ||
        metadata.defaultDescription.toLowerCase().includes(query)
      );
    });

    return CAMPAIGN_NODE_GROUPS.map((name) => ({
      name,
      types: available.filter((type) => CAMPAIGN_NODE_METADATA[type].group === name),
    })).filter((group) => group.types.length > 0);
  });

  public open(): void {
    this.isOpen.set(true);
  }

  protected toggle(event: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.isOpen.update((value) => !value);
    if (!this.isOpen()) {
      this.query.set('');
    }
  }

  protected close(): void {
    this.isOpen.set(false);
    this.query.set('');
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(type: ECampaignNodeType): void {
    this.stepSelected.emit(type);
    this.close();
  }
}
