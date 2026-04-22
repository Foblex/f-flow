import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EParsedContainerType, IParsedContainerData } from '../../../documentation-page';
import { ExternalComponent } from '../external-component';
import { CodeView } from '../../../highlight';

@Component({
  selector: 'code-group',
  templateUrl: './code-group.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-code-group',
  },
  imports: [
    ExternalComponent,
    CodeView,
  ],
})
export class CodeGroup {
  public readonly data = signal<IParsedContainerData[]>([]);

  protected readonly index = signal<number>(0);
  protected readonly containerType = EParsedContainerType;

  protected tabClick(index: number): void {
    this.index.set(index);
  }
}
