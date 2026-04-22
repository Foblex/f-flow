/**
 * Canonical portal-wide description of a core team member. Shared by
 * the home team section, the services team section, and (eventually)
 * a dedicated /team page — one place to edit names, roles, bios, and
 * future extension fields (social links, avatar, location, joined
 * year, etc.) without hunting through individual pages.
 */
export interface ITeamMember {
  /** Stable slug used for routing + deduplication against GitHub contributors. */
  readonly id: string;
  /** Uppercase 2-letter badge shown in the avatar circle. */
  readonly initials: string;
  /** Short display name (e.g. "Siarhei H."). */
  readonly name: string;
  /** Full legal/display name — used on the future /team page. */
  readonly fullName: string;
  /** Short role line (e.g. "Founder · Lead engineer"). */
  readonly role: string;
  /** One-sentence bio for cards that have room for it (services team). */
  readonly bio: string;
  /**
   * Lowercase logins this member is known by on GitHub. Used to
   * dedupe them out of the community contributors list on the home
   * page so the core team isn't shown twice. Multi-value because
   * some people contribute under more than one account.
   */
  readonly githubLogins: string[];
}
