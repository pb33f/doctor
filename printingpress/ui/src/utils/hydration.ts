import {setSchemaRegistryEntries, type RegistryEntry} from './schema-registry.js';

interface HydrationChild {
  tag: 'script' | 'template';
  type?: string;
  id?: string;
  class?: string;
  text?: string;
  html?: string;
}

interface HydrationPayload {
  attributes?: Record<string, Record<string, string>>;
  children?: Record<string, HydrationChild[]>;
  schemaRegistry?: Record<string, RegistryEntry>;
}

const sharedGlobalName = '__PP_SHARED_DATA__';
const pageGlobalName = '__PP_PAGE_DATA__';

function getBodyData(key: 'ppShared' | 'ppPage'): string {
  const body = document.body as HTMLBodyElement & {dataset: DOMStringMap};
  return body?.dataset?.[key] || '';
}

async function loadScriptPayload(assetBase: string, globalName: string): Promise<HydrationPayload | null> {
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
      reject(new Error(`unable to load script payload: ${assetBase}.js`));
    };
    document.head.appendChild(script);
  });

  const payload = (globalThis as Record<string, unknown>)[globalName] as HydrationPayload | undefined;
  delete (globalThis as Record<string, unknown>)[globalName];
  return payload || null;
}

async function loadJSONPayload(assetBase: string): Promise<HydrationPayload | null> {
  const response = await fetch(`${assetBase}.json`);
  if (!response.ok) {
    throw new Error(`unable to fetch hydration payload: ${assetBase}.json (${response.status})`);
  }
  return await response.json() as HydrationPayload;
}

async function loadHydrationPayload(assetBase: string, globalName: string): Promise<HydrationPayload | null> {
  if (!assetBase) return null;
  if (window.location.protocol === 'file:') {
    return loadScriptPayload(assetBase, globalName);
  }
  return loadJSONPayload(assetBase);
}

function applyAttributes(attributes: Record<string, Record<string, string>>) {
  for (const [targetID, attrs] of Object.entries(attributes)) {
    const el = document.getElementById(targetID);
    if (!el) continue;
    for (const [name, value] of Object.entries(attrs)) {
      el.setAttribute(name, value);
    }
  }
}

function removeHydratedChildren(target: Element) {
  target.querySelectorAll(':scope > [data-pp-hydrated="true"]').forEach((node) => node.remove());
}

function createHydratedChild(child: HydrationChild): Element {
  const el = document.createElement(child.tag);
  el.setAttribute('data-pp-hydrated', 'true');
  if (child.id) el.id = child.id;
  if (child.class) el.className = child.class;
  if (child.type && child.tag === 'script') {
    (el as HTMLScriptElement).type = child.type;
  }
  if (child.tag === 'template') {
    el.innerHTML = child.html || '';
  } else {
    el.textContent = child.text || '';
  }
  return el;
}

function applyChildren(children: Record<string, HydrationChild[]>) {
  for (const [targetID, childNodes] of Object.entries(children)) {
    const target = document.getElementById(targetID);
    if (!target) continue;
    removeHydratedChildren(target);
    for (const child of childNodes) {
      target.appendChild(createHydratedChild(child));
    }
  }
}

function applyHydrationPayload(payload: HydrationPayload | null) {
  if (!payload) return;
  if (payload.schemaRegistry) {
    setSchemaRegistryEntries(payload.schemaRegistry);
  }
  if (payload.attributes) {
    applyAttributes(payload.attributes);
  }
  if (payload.children) {
    applyChildren(payload.children);
  }
}

function notifyHydrationComplete() {
  document.dispatchEvent(new CustomEvent('pp:hydrated'));
}

export async function hydratePrintingPressPage() {
  try {
    const sharedAssetBase = getBodyData('ppShared');
    const pageAssetBase = getBodyData('ppPage');
    const sharedPayload = await loadHydrationPayload(sharedAssetBase, sharedGlobalName);
    applyHydrationPayload(sharedPayload);
    const pagePayload = await loadHydrationPayload(pageAssetBase, pageGlobalName);
    applyHydrationPayload(pagePayload);
    notifyHydrationComplete();
  } catch (error) {
    console.error('printing-press hydration failed', error);
  }
}
