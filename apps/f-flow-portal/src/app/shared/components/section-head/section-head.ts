import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'section-head',
  templateUrl: './section-head.html',
  styleUrl: './section-head.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.centered]': 'centered()',
    '[class.with-link]': '!!linkText()',
  },
  imports: [RouterLink],
})
export class SectionHead {
  public readonly kicker = input<string>();

  public readonly title = input.required<string>();

  public readonly description = input<string>();

  public readonly linkText = input<string>();

  public readonly linkRouterLink = input<string>();

  public readonly centered = input<boolean>(false);
}
