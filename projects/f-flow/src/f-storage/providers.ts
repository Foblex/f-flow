import { ComponentsDataChangedExecution } from './features/components-data-changed';
import { ListenComponentsDataChangedExecution } from './features/listen-components-data-changed';
import { FComponentsStore } from './f-components-store';
import { FTransformStore } from './f-transform-store';
import { ListenComponentsCountChangedExecution } from './features/listen-components-count-changed';
import { ListenTransformChangesExecution } from './features/listen-transform-changes';
import { TransformChangedExecution } from './features/transform-changed';

export const F_STORAGE_PROVIDERS = [

  ComponentsDataChangedExecution,

  ListenComponentsCountChangedExecution,

  ListenComponentsDataChangedExecution,

  ListenTransformChangesExecution,

  TransformChangedExecution,

  FComponentsStore,

  FTransformStore
];
