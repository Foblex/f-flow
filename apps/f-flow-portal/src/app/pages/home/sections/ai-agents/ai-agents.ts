import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHead } from '../../../../shared';

@Component({
  selector: 'home-ai-agents',
  templateUrl: './ai-agents.html',
  styleUrl: './ai-agents.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHead],
})
export class AiAgents {}
