import { Injectable } from '@angular/core';

/**
 * Feature-local registry of node/group ids flagged with `fReflowIgnore`.
 *
 * The directive registers its host id on attach and removes it on detach;
 * the orchestrator queries the set when building the candidate pool.
 *
 * Kept separate from `FNodeBase` so activating the reflow feature never
 * forces a structural change on the core node API.
 */
@Injectable()
export class FReflowIgnoreRegistry {
  private readonly _ignored = new Set<string>();

  public add(id: string): void {
    this._ignored.add(id);
  }

  public remove(id: string): void {
    this._ignored.delete(id);
  }

  public has(id: string): boolean {
    return this._ignored.has(id);
  }
}
