import { IShowcaseItem } from '@foblex/m-render';

export const SHOWCASE: IShowcaseItem[] = [
  {
    name: 'Call Center Automation Platform',
    tags: ['Workflow Automation', 'Contact Center'],
    description:
      'Open-source call-center automation reference with a visual workflow editor for designing and managing complex call handling processes.',
    imageUrl: './showcase/images/call-center.light.png',
    imageUrlDark: './showcase/images/call-center.dark.png',
    links: [
      { text: 'Demo', url: 'https://foblex.github.io/f-flow-example/' },
      { text: 'Sources', url: 'https://github.com/Foblex/f-flow-example' },
    ],
  },
  {
    name: 'Agents Platform (XpertAI)',
    tags: ['AI'],
    description:
      'An Multi agents and data analysis platform for enterprises to make business decisions.',
    imageUrl: './showcase/images/xpertai-light.png',
    links: [
      { text: 'Website', url: 'https://xpertai.cn/en/' },
      { text: 'Sources', url: 'https://github.com/xpert-ai/xpert' },
    ],
  },
  {
    name: 'Multi Agent AI Orchestration (EpicStaff)',
    tags: ['AI', 'Workflow Automation'],
    description:
      'Open-source platform designed to build and orchestrate multi-agent AI systems. It combines a visual workflow builder with full developer control.',
    imageUrl: './showcase/images/epicstaff-dark.png',
    links: [
      { text: 'Website', url: 'https://www.epicstaff.ai/' },
      { text: 'Sources', url: 'https://github.com/EpicStaff/EpicStaff' },
    ],
  },
  {
    name: 'AI Low Code Platform',
    tags: ['AI', 'Low Code'],
    description:
      'Open-source AI low-code platform for building applications and workflows through a visual editor.',
    imageUrl: './showcase/images/ai-low-code.light.png',
    imageUrlDark: './showcase/images/ai-low-code.dark.png',
    links: [
      { text: 'Demo', url: 'https://foblex.github.io/Building-AI-Low-Code-Platform5/' },
      { text: 'Sources', url: 'https://github.com/Foblex/Building-AI-Low-Code-Platform5' },
    ],
  },
  {
    name: 'Schema Designer',
    tags: ['Dev Tools'],
    description:
      'Visual schema design interface with editable entities, relations, and richer editor interactions.',
    imageUrl: './showcase/images/db-management-flow.light.png',
    imageUrlDark: './showcase/images/db-management-flow.dark.png',
    links: [
      {
        text: 'Demo',
        url: 'https://flow.foblex.com/examples/schema-designer',
      },
      { text: 'Sources', url: 'https://github.com/Foblex/f-flow' },
    ],
  },
  {
    name: 'ProcessMIX',
    tags: ['Workflow Automation', 'Low Code'],
    description:
      'Low-code decision automation platform with a visual rules and workflow builder for designing, testing, and deploying processes rapidly.',
    imageUrl: './showcase/images/processmix.dark.png',
    links: [{ text: 'Website', url: 'https://processmix.com/' }],
  },
  {
    name: 'Luware Nimbus',
    tags: ['Contact Center'],
    description:
      'Cloud-based SaaS contact-center solution built natively for Microsoft Teams. It unifies internal helpdesks, branch offices and global contact centres into one intelligent hub, enabling omni-channel communication (voice, chat, email, tasks) and routing to the right agents based on skills, priority or context. ',
    imageUrl: './showcase/images/luware-nimbus.light.png',
    links: [{ text: 'Website', url: 'https://luware.com/products/nimbus' }],
  },
];
