export interface IShowcaseItem {
  name: string;
  description: string;
  imageUrl: string;
  imageUrlDark?: string;
  links: { text: 'Website' | 'Demo' | 'Sources'; url: string }[];
  tags?: string[];
}
