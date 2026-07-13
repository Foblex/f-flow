import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CallCenterFlow } from './components/call-center-flow/call-center-flow';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CallCenterFlow],
})
export class AppComponent {}
