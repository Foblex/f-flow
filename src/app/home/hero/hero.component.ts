import { Component } from '@angular/core';
import { ButtonsRowComponent } from './buttons-row/buttons-row.component';

@Component({
  selector: 'hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  standalone: true,
  imports: [
    ButtonsRowComponent
  ]
})
export class HeroComponent {

}
