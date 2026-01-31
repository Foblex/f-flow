import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ai-low-code-platform',
  styleUrls: ['./ai-low-code-platform.scss'],
  templateUrl: './ai-low-code-platform.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class AiLowCodePlatform {
  protected url = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://foblex.github.io/Building-AI-Low-Code-Platform5/',
  );
}
