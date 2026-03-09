import { IUmlGroupViewModel } from '../i-uml-model';

export const UML_GROUPS: IUmlGroupViewModel[] = [
  {
    id: 'pkg-domain',
    position: { x: 40, y: 90 },
    size: { width: 780, height: 720 },
    data: {
      name: 'Domain Layer',
      description: 'Business entities and value objects that define the core model.',
      layer: 'domain',
    },
  },
  {
    id: 'pkg-application',
    position: { x: 880, y: 90 },
    size: { width: 660, height: 620 },
    data: {
      name: 'Application Layer',
      description: 'Use cases, orchestration, and service contracts.',
      layer: 'application',
    },
  },
  {
    id: 'pkg-infrastructure',
    position: { x: 40, y: 840 },
    size: { width: 1500, height: 300 },
    data: {
      name: 'Infrastructure Layer',
      description: 'Adapters for database and external systems.',
      layer: 'infrastructure',
    },
  },
];
