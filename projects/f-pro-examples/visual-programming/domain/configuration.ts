import { ENodeType } from './e-node-type';

export const NODE_CONFIGURATION = {
  [ ENodeType.Input ]: {
    color: '#e0575b',
    text: 'Input',
  },
  [ ENodeType.Assign ]: {
    color: '#9f6a00',
    text: 'Assign',
  },
  [ ENodeType.Switch ]: {
    color: '#8e5cd9',
    text: 'Switch',
  },
  [ ENodeType.Cycle ]: {
    color: '#8e5cd9',
    text: 'Cycle',
  },
  [ ENodeType.Error ]: {
    color: '#ec8a82',
    text: 'Error',
  },
  [ ENodeType.Database ]: {
    color: '#30a46c',
    text: 'Database',
  },
  [ ENodeType.Hash ]: {
    color: '#8e5cd9',
    text: 'Function',
  },
};
