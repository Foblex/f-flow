import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {takeScreenshot} from './take-screenshot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  host: {
    'ngSkipHydration': '',
  },
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    matIconRegistry: MatIconRegistry,
  ) {
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  protected takeScreenshot(): void {
    takeScreenshot('f-flow').then();
  }
}
