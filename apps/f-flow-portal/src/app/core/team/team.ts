import { ITeamMember } from './team-member';

/**
 * Single source of truth for the core Foblex team. Edit here and
 * every portal surface (home team section, services team section,
 * and the upcoming /team page) picks it up automatically.
 */
export const TEAM: readonly ITeamMember[] = [
  {
    id: 'siarhei-h',
    initials: 'SH',
    name: 'Siarhei H.',
    fullName: 'Siarhei Huzarevich',
    role: 'Founder · Lead engineer',
    bio: 'Built Foblex Flow from day one. Angular since v2.',
    githubLogins: ['siarheihuzarevich'],
  },
  {
    id: 'mark-w',
    initials: 'MW',
    name: 'Mark K.',
    fullName: 'Mark Wojno',
    role: 'Engineer',
    bio: 'Full-stack. Specializes in complex editor interactions.',
    githubLogins: ['markwojno'],
  },
  {
    id: 'siarhei-k',
    initials: 'SK',
    name: 'Siarhei Kh.',
    fullName: 'Siarhei Khudzinski.',
    role: 'Engineer · DX',
    bio: 'Angular performance and SSR. Author of internal f-cache.',
    githubLogins: ['siarheikhudzinski'],
  },
];

/**
 * Set of every lowercase GitHub login claimed by a core member.
 * Used when rendering community contributors to make sure the core
 * team doesn't get listed twice.
 */
export const CORE_GITHUB_LOGINS: ReadonlySet<string> = new Set(
  TEAM.flatMap((member) => member.githubLogins.map((login) => login.toLowerCase())),
);
