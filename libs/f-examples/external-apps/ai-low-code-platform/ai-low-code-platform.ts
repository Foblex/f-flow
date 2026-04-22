import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ai-low-code-platform',
  templateUrl: './ai-low-code-platform.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AiLowCodePlatform {
  protected url = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://foblex.github.io/Building-AI-Low-Code-Platform5/',
  );
}
