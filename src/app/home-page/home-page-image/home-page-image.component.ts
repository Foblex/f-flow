import { Component } from '@angular/core';

@Component({
  selector: 'home-page-image',
  templateUrl: './home-page-image.component.html',
  styleUrl: './home-page-image.component.scss',
  standalone: true,
  host: {
    'id': 'home-page-image-container',
  }
})
export class HomePageImageComponent {
}
