export interface IMarkdownItToken {

  type: string;

  tag: string;

  attrs: Array<[string, string]> | null;

  map: [number, number] | null;

  nesting: -1 | 0 | 1;

  level: number;

  children: IMarkdownItToken[] | null;

  content: string;

  markup: string;

  info: string;

  meta: any;

  block: boolean;

  hidden: boolean;
}


