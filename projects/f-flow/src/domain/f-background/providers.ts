import { AddPatternToBackgroundExecution } from './add-pattern-to-background';
import { AddBackgroundToStoreExecution } from './add-background-to-store';
import { RemoveBackgroundFromStoreExecution } from './remove-background-from-store';
import { SetBackgroundTransformExecution } from './set-background-transform';

/**
 * This file exports all the background-related features for the F-Flow domain.
 * It includes executions for adding, removing, and setting the background in the FComponentsStore.
 */
export const F_BACKGROUND_FEATURES = [

  AddBackgroundToStoreExecution,

  AddPatternToBackgroundExecution,

  RemoveBackgroundFromStoreExecution,

  SetBackgroundTransformExecution,
];
