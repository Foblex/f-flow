import { HeroFlowConfiguration } from '../models/hero-flow-configuration';
import { HeroConnectionStyle } from '../enums/hero-connection-style';
import { HeroNodeType } from '../enums/hero-node-type';
import { EFConnectionBehavior, EFConnectionConnectableSide, EFConnectionType } from '@foblex/flow';

export const HERO_FLOW: HeroFlowConfiguration = {
  nodes: [
    {
      uid: 'login-screen-node',
      position: { x: 442, y: 286 },
      type: HeroNodeType.SCREEN,
      rotate: -28,
    },
    {
      uid: 'decision-node',
      position: { x: 722, y: 216 },
      type: HeroNodeType.DECISION,
      rotate: -45,
    },
    {
      uid: 'yes-node',
      position: { x: 870, y: 144 },
      type: HeroNodeType.YES,
      rotate: -14,
    },
    {
      uid: 'no-node',
      position: { x: 890, y: 388 },
      type: HeroNodeType.NO,
      rotate: 14,
    },
    {
      uid: 'onboarding-node',
      position: { x: 1024, y: 50 },
      type: HeroNodeType.ONBOARDING,
      rotate: 0,
    },
    {
      uid: 'menu-node',
      position: { x: 934, y: 470 },
      type: HeroNodeType.MENU,
      rotate: -18,
    },
  ],
  connections: [
    {
      source: 'login-screen-node',
      sourceSide: EFConnectionConnectableSide.RIGHT,
      target: 'decision-node',
      style: HeroConnectionStyle.ANIMATED,
      type: EFConnectionType.ADAPTIVE_CURVE,
      behaviour: EFConnectionBehavior.FIXED,
    },
    {
      source: 'decision-node',
      target: 'yes-node',
      style: HeroConnectionStyle.ANIMATED,
      type: EFConnectionType.ADAPTIVE_CURVE,
      behaviour: EFConnectionBehavior.FIXED,
    },
    {
      source: 'yes-node',
      target: 'onboarding-node',
      targetSide: EFConnectionConnectableSide.LEFT,
      style: HeroConnectionStyle.ANIMATED,
      type: EFConnectionType.ADAPTIVE_CURVE,
      behaviour: EFConnectionBehavior.FIXED,
    },
    {
      source: 'decision-node',
      target: 'no-node',
      style: HeroConnectionStyle.SOLID,
      type: EFConnectionType.STRAIGHT,
      behaviour: EFConnectionBehavior.FLOATING,
    },
    {
      source: 'onboarding-node',
      sourceSide: EFConnectionConnectableSide.BOTTOM,
      target: 'menu-node',
      targetSide: EFConnectionConnectableSide.TOP,
      style: HeroConnectionStyle.DASHED,
      type: EFConnectionType.SEGMENT,
      behaviour: EFConnectionBehavior.FIXED,
    },
  ],
};
