import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IUmlPackage } from '../../domain';

@Component({
  selector: 'uml-package-group',
  templateUrl: './package-group.html',
  styleUrls: ['./package-group.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageGroup {
  public readonly package = input.required<IUmlPackage>();
}
