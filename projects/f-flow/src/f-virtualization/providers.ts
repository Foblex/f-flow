import { FNodeSizeRegistry } from './f-node-size-registry';
import { FVisibilityService } from './f-visibility.service';
import { FMeasurementPipeline } from './f-measurement-pipeline';
import { FVirtualizationService } from './f-virtualization.service';

export const F_VIRTUALIZATION_PROVIDERS = [
  FNodeSizeRegistry,
  FVisibilityService,
  FMeasurementPipeline,
  FVirtualizationService,
];
