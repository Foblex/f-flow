import {ChangeDetectionStrategy, Component, inject, model} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../auth/user-service";
import {toSignal} from "@angular/core/rxjs-interop";
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatInput,
    MatButtonModule,
  ]
})
export class AssistantComponent  {

  protected readonly user = toSignal(inject(UserService).user$);

  protected readonly question = model<string>();
  protected readonly answer = model<SafeHtml | undefined>();
}
