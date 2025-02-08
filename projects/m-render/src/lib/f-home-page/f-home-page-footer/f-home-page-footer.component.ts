import { Component, inject } from '@angular/core';
import { FHomePageEnvironmentService } from '../f-home-page-environment.service';

@Component({
  selector: 'footer[f-home-page-footer]',
  templateUrl: './f-home-page-footer.component.html',
  styleUrl: './f-home-page-footer.component.scss',
  standalone: true,
})
export class FHomePageFooterComponent {

  protected viewModel = inject(FHomePageEnvironmentService).getFooter();
}
