export type HTMLAssetMode = 'portable' | 'served';

export function getBodyData(key: string): string {
  const body = document.body as HTMLBodyElement & {dataset: DOMStringMap};
  return body?.dataset?.[key] || '';
}

export function getHTMLAssetMode(): HTMLAssetMode {
  const mode = getBodyData('ppAssetMode');
  return mode === 'served' ? 'served' : 'portable';
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
    script.src = `${assetBase}.js`;
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
  const response = await fetch(`${assetBase}.json`);
  if (!response.ok) {
    throw new Error(`unable to fetch asset: ${assetBase}.json (${response.status})`);
  }
  return await response.json() as T;
}
