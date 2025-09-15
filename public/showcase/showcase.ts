import { IShowcaseItem } from '@foblex/m-render';

export const SHOWCASE: IShowcaseItem[] = [
  {
    name: 'Call Center Automation Platform',
    tags: ['Workflow Automation', 'No Code', 'Open Source'],
    description:
      'Open Source solution designed to streamline and automate call center operations. It provides a visual interface for creating and managing workflows, enabling users to design complex call handling processes without writing code.',
    imageUrl: './showcase/images/call-center.light.png',
    imageUrlDark: './showcase/images/call-center.dark.png',
    links: [
      { text: 'Demo', url: 'https://foblex.github.io/f-flow-example/' },
      { text: 'Sources', url: 'https://github.com/Foblex/f-flow-example' },
    ],
  },
  {
    name: 'DB Management System',
    tags: ['No Code', 'Open Source', 'Dev Tools'],
    description:
      'Database management system that provides a user-friendly interface for managing and interacting with databases.',
    imageUrl: './showcase/images/db-management-flow.light.png',
    imageUrlDark: './showcase/images/db-management-flow.dark.png',
    links: [
      {
        text: 'Demo',
        url: 'https://flow.foblex.com/examples/f-db-management-flow',
      },
      { text: 'Sources', url: 'https://github.com/Foblex/f-flow' },
    ],
  },
];
