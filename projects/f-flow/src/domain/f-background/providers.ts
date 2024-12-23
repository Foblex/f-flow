import { AddPatternToBackgroundExecution } from './add-pattern-to-background';
import { AddBackgroundToStoreExecution } from './add-background-to-store';
import { RemoveBackgroundFromStoreExecution } from './remove-background-from-store';
import { SetBackgroundTransformExecution } from './set-background-transform';

export const F_BACKGROUND_FEATURES = [

  AddBackgroundToStoreExecution,

  AddPatternToBackgroundExecution,

  RemoveBackgroundFromStoreExecution,

  SetBackgroundTransformExecution
];
