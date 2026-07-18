import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CampaignStudio } from './components/campaign-studio/campaign-studio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CampaignStudio],
  template: '<campaign-studio />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
