import { Component, inject } from '@angular/core';
import { FThemeButtonComponent } from '../../common-components';
import { FHomePageEnvironmentService } from '../f-home-page-environment.service';

@Component({
  selector: 'header[f-home-page-header]',
  templateUrl: './f-home-page-header.component.html',
  styleUrl: './f-home-page-header.component.scss',
  standalone: true,
  imports: [
    FThemeButtonComponent
  ]
})
export class FHomePageHeaderComponent {

  protected logo = inject(FHomePageEnvironmentService).getLogo();

  protected title = inject(FHomePageEnvironmentService).getTitle();
}
