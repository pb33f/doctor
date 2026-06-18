export type HTMLAssetMode = 'portable' | 'served';

const SCHEME_HREF_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

export function getBodyData(key: string): string {
  const body = document.body as HTMLBodyElement & {dataset: DOMStringMap};
  return body?.dataset?.[key] || '';
}

export function getHTMLAssetMode(): HTMLAssetMode {
  const mode = getBodyData('ppAssetMode');
  return mode === 'served' ? 'served' : 'portable';
}

export function runtimeAssetHref(assetBase: string, extension: string): string {
  const href = `${assetBase}${extension}`;
  const configuredBase = getBodyData('ppBaseUrl');
  if (!configuredBase || href.startsWith('#') || href.startsWith('data:') || SCHEME_HREF_RE.test(href)) {
    return href;
  }
  try {
    return new URL(href, new URL(configuredBase, window.location.href)).toString();
  } catch {
    return href;
  }
}

export async function loadAsset<T>(assetBase: string, globalName: string, assetMode: HTMLAssetMode = getHTMLAssetMode()): Promise<T | null> {
  if (!assetBase) return null;
  if (assetMode === 'portable') {
    return loadScriptAsset<T>(assetBase, globalName);
  }
  return loadJSONAsset<T>(assetBase);
}

async function loadScriptAsset<T>(assetBase: string, globalName: string): Promise<T | null> {
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = runtimeAssetHref(assetBase, '.js');
    script.async = false;
    script.onload = () => {
      script.remove();
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`unable to load script asset: ${assetBase}.js`));
    };
    document.head.appendChild(script);
  });

  const payload = (globalThis as Record<string, unknown>)[globalName] as T | undefined;
  delete (globalThis as Record<string, unknown>)[globalName];
  return payload || null;
}

async function loadJSONAsset<T>(assetBase: string): Promise<T | null> {
  const href = runtimeAssetHref(assetBase, '.json');
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`unable to fetch asset: ${href} (${response.status})`);
  }
  return await response.json() as T;
}
