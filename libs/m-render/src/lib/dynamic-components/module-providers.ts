import { DynamicComponentsStore } from './dynamic-components.store';
import { PreviewGroupService } from './components';
import { RenderDynamicComponent, RenderExternalComponent, RenderInternalComponents } from './features';

export const DYNAMIC_COMPONENTS_MODULE_PROVIDERS = [
  DynamicComponentsStore,

  PreviewGroupService,

  RenderDynamicComponent,

  RenderExternalComponent,

  RenderInternalComponents,
];
