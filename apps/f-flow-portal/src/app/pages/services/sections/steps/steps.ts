import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead } from '../../../../shared';

type StepIcon = 'email' | 'proposal' | 'build' | 'handoff';

interface IStep {
  num: string;
  icon: StepIcon;
  title: string;
  meta: string;
  description: string;
}

@Component({
  selector: 'services-steps',
  templateUrl: './steps.html',
  styleUrl: './steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Steps {
  protected readonly steps: IStep[] = [
    {
      num: 'Step 01',
      icon: 'email',
      title: 'Intro email',
      meta: 'Async · free',
      description:
        "You email us support@foblex.com describing the editor you need. We reply within 1–2 business days with questions or a go/no-go — no pitch if it doesn't fit.",
    },
    {
      num: 'Step 02',
      icon: 'proposal',
      title: 'Proposal',
      meta: 'Within 3 business days',
      description:
        'A written scope, timeline, and fixed price. No surprises, no hourly creep. You review, we refine if needed, and we agree on start date.',
    },
    {
      num: 'Step 03',
      icon: 'build',
      title: 'Build',
      meta: 'Fixed duration per tier',
      description:
        'We build, you review. Weekly written updates, clean commits, production-grade code. All communication via email and shared docs.',
    },
    {
      num: 'Step 04',
      icon: 'handoff',
      title: 'Handoff',
      meta: 'Written delivery',
      description:
        'Documentation, written walkthrough, and a Q&A window. Your team can maintain it independently from day one.',
    },
  ];
}
