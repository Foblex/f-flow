export function isMobile(): boolean {
  // @ts-ignore
  return /android|iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window[ 'opera' ])
}
