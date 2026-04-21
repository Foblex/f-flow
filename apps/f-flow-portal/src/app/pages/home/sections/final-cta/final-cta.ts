import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-final-cta',
  templateUrl: './final-cta.html',
  styleUrl: './final-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class FinalCta {}
