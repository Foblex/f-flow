import { AddPatternToBackground } from './add-pattern-to-background';
import { SetBackgroundTransform } from './set-background-transform';
import { fExecution } from '../../_libs/f-mediator';
import { AddPatternToBackgroundRequest } from './add-pattern-to-background/add-pattern-to-background-request';
import { SetBackgroundTransformRequest } from './set-background-transform/set-background-transform-request';

/**
 * This file exports all the background-related features for the F-Flow domain.
 * It includes executions for adding, removing, and setting the background in the FComponentsStore.
 */
export const F_BACKGROUND_FEATURES = [
  fExecution(AddPatternToBackgroundRequest, AddPatternToBackground),

  fExecution(SetBackgroundTransformRequest, SetBackgroundTransform),
];
