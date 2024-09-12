import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'buttons-row',
  templateUrl: './buttons-row.component.html',
  styleUrl: './buttons-row.component.scss',
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class ButtonsRowComponent {

}
