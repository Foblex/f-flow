import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  FThemeButtonComponent
} from '@foblex/m-render';

@Component({
  selector: 'header[header]',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FThemeButtonComponent
  ]
})
export class HeaderComponent {

}
