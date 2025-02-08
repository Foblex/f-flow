import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';

@Component({
  selector: 'f-version',
  templateUrl: './f-version.component.html',
  styleUrls: [ './f-version.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe
  ]
})
export class FVersionComponent {

  protected version$: Observable<string | undefined> = inject(FDocumentationEnvironmentService).getVersion();
}
