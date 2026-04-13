import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IUmlGroupViewModel } from '../../domain';

@Component({
  selector: 'uml-package-card',
  templateUrl: './uml-package-card.html',
  styleUrls: ['./uml-package-card.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UmlPackageCard {
  public readonly group = input.required<IUmlGroupViewModel>();
}
