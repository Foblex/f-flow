import { FTriggerEvent } from '../../../domain';
import { isNode } from '../../../f-node';

/**
 * `true` when the event started over the empty canvas background rather than over a
 * node, a group or a connection. Useful to make a left-drag select only on empty space
 * while a left-drag on a node still moves it.
 */
export function isOnFlowBackground(event: FTriggerEvent): boolean {
  const target = event.target as HTMLElement | null;

  return (
    !!target && !isNode(target) && !target.closest('[fGroup]') && !target.closest('.f-connection')
  );
}
