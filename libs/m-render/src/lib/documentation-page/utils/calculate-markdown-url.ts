import { INavigationGroup } from '../components';

export function calculateMarkdownUrl(markdown: string, navigation: INavigationGroup[], docsDir: string, notFoundMd = ''): string {
  if (!markdown || !_isMarkdownExist(markdown, navigation) && navigation.length) {
    return notFoundMd;
  }
  let url = docsDir + markdown;

  url = url.replace(/(\/en\/guides)+/g, '/en/guides');
  url = url.replace(/(\/en\/examples)+/g, '/en/examples');

  if (!url.endsWith('.md')) {
    url += '.md';
  }

  return url;
}

function _isMarkdownExist(id: string, navigation: INavigationGroup[]): boolean {
  return !!navigation.find((x) =>
    x.items.some((i: { link: string; }) => i.link === id),
  );
}
