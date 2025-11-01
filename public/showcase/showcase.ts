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
    name: 'Multi Agent AI Orchestration (EpicStaff)',
    tags: ['AI Automation', 'Multi-Agent Systems', 'Open Source'],
    description:
      'Open-source platform designed to build and orchestrate multi-agent AI systems. It combines a visual workflow builder with full developer control.',
    imageUrl: './showcase/images/epicstaff-dark.png',
    links: [
      { text: 'Website', url: 'https://www.epicstaff.ai/' },
      { text: 'Sources', url: 'https://github.com/EpicStaff/EpicStaff' },
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
  {
    name: 'ProcessMIX',
    tags: ['Low-Code', 'Business Rules Engine', 'Decision Automation'],
    description:
      'Low-code/no-code platform that enables businesses to automate decision-making and build complex workflows visually. It provides a powerful rules engine and integration tools to connect with external systems, allowing teams to design, test, and deploy processes rapidly.',
    imageUrl: './showcase/images/processmix.dark.png',
    links: [{ text: 'Website', url: 'https://processmix.com/' }],
  },
  {
    name: 'Luware Nimbus',
    tags: ['Omnichannel Contact Center', 'Microsoft Teams Integration', 'Intelligent Routing'],
    description:
      'Cloud-based SaaS contact-center solution built natively for Microsoft Teams. It unifies internal helpdesks, branch offices and global contact centres into one intelligent hub, enabling omni-channel communication (voice, chat, email, tasks) and routing to the right agents based on skills, priority or context. ',
    imageUrl: './showcase/images/luware-nimbus.light.png',
    links: [{ text: 'Website', url: 'https://luware.com/products/nimbus' }],
  },
];
