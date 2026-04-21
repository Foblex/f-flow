import { IPoint } from '@foblex/2d';
import { ServiceNodeType } from '../enums/service-node-type';

/** Icon keys supported by the compound build-node chip row. */
export type ServiceChipIcon = 'refresh' | 'clock';

export interface IServiceChip {
  icon: ServiceChipIcon;
  title: string;
  meta: string;
}

export interface ServiceNode {
  uid: string;
  position: IPoint;
  type: ServiceNodeType;
  rotate: number;
  data?: {
    step?: string;
    title: string;
    meta?: string;
    bullets?: string[];
    chips?: IServiceChip[];
  };
}
