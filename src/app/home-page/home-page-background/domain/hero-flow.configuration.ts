import { EFConnectableSide } from '@foblex/flow';
import { IHeroFlowConfiguration } from './i-hero-flow-configuration';

export const HERO_FLOW_CONFIGURATION: IHeroFlowConfiguration = {
  nodes: [
    {
      uid: '1',
      position: { x: 180, y: 281 },
      to: EFConnectableSide.AUTO,
      from: EFConnectableSide.TOP,
      large: true,
      text: 'Angular 12+'
    },
    {
      uid: '2',
      to: EFConnectableSide.LEFT,
      from: EFConnectableSide.BOTTOM,
      position: { x: 342, y: 199 },
      text: 'Zone Less'
    },
    {
      uid: '3',
      to: EFConnectableSide.TOP,
      from: EFConnectableSide.AUTO,
      position: { x: 342, y: 385 },
      text: 'MIT License'
    }
  ],
  connections: [
    {
      output: '1',
      input: '2',
    },
    {
      output: '2',
      input: '3',
    }
  ]
};
