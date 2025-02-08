import { Component, inject } from '@angular/core';
import { FHomePageButtonsRowComponent } from './f-home-page-buttons-row/f-home-page-buttons-row.component';
import { FHomePageEnvironmentService } from '../f-home-page-environment.service';

@Component({
  selector: 'f-home-page-hero',
  templateUrl: './f-home-page-hero.component.html',
  styleUrl: './f-home-page-hero.component.scss',
  standalone: true,
  imports: [
    FHomePageButtonsRowComponent
  ]
})
export class FHomePageHeroComponent {

  protected viewModel = inject(FHomePageEnvironmentService).getHero();
}
