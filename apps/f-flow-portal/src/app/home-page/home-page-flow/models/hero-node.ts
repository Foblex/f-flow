import { IPoint } from '@foblex/2d';
import { HeroNodeType } from '../enums/hero-node-type';

export interface HeroNode {
  uid: string;
  position: IPoint;
  type: HeroNodeType;
  rotate: number;
}
