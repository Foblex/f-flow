import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IUmlNodeViewModel } from '../../domain';

@Component({
  selector: 'uml-node-card',
  templateUrl: './uml-node-card.html',
  styleUrls: ['./uml-node-card.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UmlNodeCard {
  public readonly node = input.required<IUmlNodeViewModel>();
}
