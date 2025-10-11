import { AddLineAlignmentToStore } from './add-line-alignment-to-store';
import { RemoveLineAlignmentFromStore } from './remove-line-alignment-from-store';

/**
 * Collection of all FLineAlignment feature executions.
 * These executions handle the addition and removal of line alignments
 * in the FComponentsStore.
 */
export const F_LINE_ALIGNMENT_FEATURES = [AddLineAlignmentToStore, RemoveLineAlignmentFromStore];
