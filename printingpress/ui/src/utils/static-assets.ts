const sharedAssetBaseAttribute = 'data-pp-shared-asset-base-url';

export function normalizeSharedAssetBaseURL(value: string | null | undefined): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.replace(/\/+$/, '') || '/';
}

export function documentSharedAssetBaseURL(): string {
  if (typeof document === 'undefined') {
    return '';
  }
  const htmlBase = document.documentElement.getAttribute(sharedAssetBaseAttribute);
  if (htmlBase && htmlBase.trim()) {
    return normalizeSharedAssetBaseURL(htmlBase);
  }
  return normalizeSharedAssetBaseURL(document.body?.getAttribute(sharedAssetBaseAttribute));
}

export function printingPressStaticAssetHref(path: string, sharedAssetBaseURL = documentSharedAssetBaseURL()): string {
  const cleanPath = path.replace(/^\/+/, '');
  const baseURL = normalizeSharedAssetBaseURL(sharedAssetBaseURL);
  if (baseURL === '/') {
    return `/${cleanPath}`;
  }
  if (baseURL) {
    return `${baseURL}/${cleanPath}`;
  }
  return `static/${cleanPath}`;
}
