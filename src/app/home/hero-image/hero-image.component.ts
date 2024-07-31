import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'hero-image',
  templateUrl: './hero-image.component.html',
  styleUrl: './hero-image.component.scss',
  standalone: true,
  host: {
    'id': 'hero-image-container',
  }
})
export class HeroImageComponent {

  public get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }
}
