import { Component } from '@angular/core';

@Component({
  selector: 'membership-page-image',
  templateUrl: './membership-page-image.component.html',
  styleUrl: './membership-page-image.component.scss',
  standalone: true,
  host: {
    'id': 'home-page-image-container',
  }
})
export class MembershipPageImageComponent {
}
