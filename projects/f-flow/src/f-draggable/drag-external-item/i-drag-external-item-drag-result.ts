import { FExternalItemBase } from '../../f-external-item';

export interface IDragExternalItemDragResult {
  preview: HTMLElement | SVGElement;
  externalItem: FExternalItemBase<unknown>;
}
