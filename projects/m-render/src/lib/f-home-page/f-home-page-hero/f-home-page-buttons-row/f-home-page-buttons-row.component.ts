import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FHomePageEnvironmentService } from '../../f-home-page-environment.service';

@Component({
  selector: 'f-home-page-buttons-row',
  templateUrl: './f-home-page-buttons-row.component.html',
  styleUrl: './f-home-page-buttons-row.component.scss',
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class FHomePageButtonsRowComponent {

  protected viewModel = inject(FHomePageEnvironmentService).getButtons();
}
