import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { EFLayoutDirection } from '@foblex/flow';
import { CampaignEditorController } from '../../controllers';
import { CampaignTheme } from '../../services';
import { ECampaignViewportAction } from './e-campaign-viewport-action';

@Component({
  selector: 'campaign-toolbar',
  standalone: true,
  imports: [MatIcon, MatTooltip],
  templateUrl: './campaign-toolbar.html',
  styleUrls: ['./campaign-toolbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignToolbar {
  protected readonly controller = inject(CampaignEditorController);
  protected readonly theme = inject(CampaignTheme);
  protected readonly direction = EFLayoutDirection;
  protected readonly viewportAction = ECampaignViewportAction;

  public readonly viewportActionRequested = output<ECampaignViewportAction>();
  public readonly directionRequested = output<EFLayoutDirection>();
  public readonly resetRequested = output<void>();

  protected undo(): void {
    void this.controller.undo();
  }

  protected redo(): void {
    void this.controller.redo();
  }
}
