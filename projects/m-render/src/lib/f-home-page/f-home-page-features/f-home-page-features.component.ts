import { Component, inject } from '@angular/core';
import { FHomePageEnvironmentService } from '../f-home-page-environment.service';

@Component({
  selector: 'f-home-page-features',
  templateUrl: './f-home-page-features.component.html',
  styleUrl: './f-home-page-features.component.scss',
  standalone: true,
})
export class FHomePageFeaturesComponent {

  protected viewModel = inject(FHomePageEnvironmentService).getFeatures();
}
