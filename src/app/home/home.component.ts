import { Component } from '@angular/core';
import { FeaturesComponent } from './features/features.component';
import { HeroComponent } from './hero/hero.component';
import { HeaderComponent } from './header/header.component';
import { HeroFlowComponent } from './hero-flow/hero-flow.component';
import { HeroImageComponent } from './hero-image/hero-image.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    FeaturesComponent,
    HeroComponent,
    HeaderComponent,
    HeroFlowComponent,
    HeroImageComponent,
    FooterComponent
  ]
})
export class HomeComponent {

}
