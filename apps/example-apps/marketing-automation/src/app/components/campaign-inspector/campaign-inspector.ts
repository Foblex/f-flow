import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CampaignEditorController } from '../../controllers';
import { CAMPAIGN_NODE_METADATA } from '../../domain';

@Component({
  selector: 'campaign-inspector',
  standalone: true,
  imports: [MatButton, MatIcon, MatIconButton, MatTooltip],
  templateUrl: './campaign-inspector.html',
  styleUrls: ['./campaign-inspector.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInspector {
  protected readonly controller = inject(CampaignEditorController);
  protected readonly metadata = CAMPAIGN_NODE_METADATA;

  public readonly closeRequested = output<void>();
  public readonly deleteRequested = output<void>();

  protected updateText(key: 'title' | 'description' | 'detail', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value.trim();
    const node = this.controller.selectedNode();
    if (node && value && node[key] !== value) {
      this.controller.updateSelectedStep({ [key]: value });
    }
  }
}
