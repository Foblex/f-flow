import { FTriggerEvent } from '../../../domain';
import { isNode } from '../../../f-node';
import { getEventTargetElement } from '../../../utils/get-event-target-element';

/**
 * `true` when the event started over the empty canvas background rather than over a
 * node, a group or a connection. Useful to make a left-drag select only on empty space
 * while a left-drag on a node still moves it.
 */
export function isOnFlowBackground(event: FTriggerEvent): boolean {
  const target = getEventTargetElement(event, 'f-flow');

  return (
    !!target && !isNode(target) && !target.closest('[fGroup]') && !target.closest('.f-connection')
  );
}
