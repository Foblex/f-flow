import { PreventDefaultIsExternalItem } from './prevent-default-is-external-item';
import { DragExternalItemCreatePlaceholder } from './drag-external-item-create-placeholder';
import { DragExternalItemCreatePreview } from './drag-external-item-create-preview';
import { DragExternalItemFinalize } from './drag-external-item-finalize';
import { DragExternalItemPreparation } from './drag-external-item-preparation';
import { fExecution } from '../../_libs/f-mediator';
import { DragExternalItemCreatePlaceholderRequest } from './drag-external-item-create-placeholder/drag-external-item-create-placeholder-request';
import { DragExternalItemCreatePreviewRequest } from './drag-external-item-create-preview/drag-external-item-create-preview-request';
import { DragExternalItemFinalizeRequest } from './drag-external-item-finalize/drag-external-item-finalize-request';
import { DragExternalItemPreparationRequest } from './drag-external-item-preparation/drag-external-item-preparation-request';
import { PreventDefaultIsExternalItemRequest } from './prevent-default-is-external-item/prevent-default-is-external-item-request';

export const DRAG_EXTERNAL_ITEM_PROVIDERS = [
  fExecution(DragExternalItemCreatePlaceholderRequest, DragExternalItemCreatePlaceholder),

  fExecution(DragExternalItemCreatePreviewRequest, DragExternalItemCreatePreview),

  fExecution(DragExternalItemFinalizeRequest, DragExternalItemFinalize),

  fExecution(DragExternalItemPreparationRequest, DragExternalItemPreparation),

  fExecution(PreventDefaultIsExternalItemRequest, PreventDefaultIsExternalItem),
];
