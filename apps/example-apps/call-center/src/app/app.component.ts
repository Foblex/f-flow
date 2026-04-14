import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Flow } from './components/flow/flow';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Flow],
})
export class AppComponent {}
