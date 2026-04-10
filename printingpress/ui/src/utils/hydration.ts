import {setSchemaRegistryEntries, type RegistryEntry} from './schema-registry.js';
import {getBodyData, loadAsset} from './asset-loader.js';

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
  model?: {
    name: string;
    componentType: string;
    description?: string;
    typeSlug: string;
    slug: string;
    schemaJson: string;
    mockJson?: string;
    rawYaml?: string;
    schemaRawYaml?: string;
    schemaRawJson?: string;
  };
}

const sharedGlobalName = '__PP_SHARED_DATA__';
const pageGlobalName = '__PP_PAGE_DATA__';

interface BootstrapStore {
  shared?: HydrationPayload | null;
  page?: HydrationPayload | null;
  sharedPromise?: Promise<HydrationPayload | null>;
  pagePromise?: Promise<HydrationPayload | null>;
}

interface ApplyHydrationOptions {
  includeModel?: boolean;
}

function getBootstrapStore(): BootstrapStore | null {
  return (globalThis as Record<string, unknown>).__PP_BOOTSTRAP__ as BootstrapStore || null;
}

async function loadHydrationPayload(assetBase: string, globalName: string, kind: 'shared' | 'page'): Promise<HydrationPayload | null> {
  const store = getBootstrapStore();
  const pending = kind === 'shared' ? store?.sharedPromise : store?.pagePromise;
  if (pending) {
    try {
      return await pending;
    } catch {
      const cached = store?.[kind];
      if (cached) {
        return cached || null;
      }
    }
  }

  if (store?.[kind]) {
    return store[kind] || null;
  }

  return loadAsset<HydrationPayload>(assetBase, globalName);
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

function applyHydrationPayload(payload: HydrationPayload | null, options: ApplyHydrationOptions = {}) {
  if (!payload) return;
  const includeModel = options.includeModel ?? true;
  if (payload.schemaRegistry) {
    setSchemaRegistryEntries(payload.schemaRegistry);
  }
  if (payload.attributes) {
    applyAttributes(payload.attributes);
  }
  if (payload.children) {
    applyChildren(payload.children);
  }
  if (includeModel && payload.model) {
    applyModelPayload(payload.model);
  }
}

function applyModelPayload(model: NonNullable<HydrationPayload['model']>) {
  const modelPage = document.getElementById('pp-model-page');
  if (modelPage) {
    modelPage.setAttribute('model-json', model.schemaJson);
    if (model.mockJson) {
      modelPage.setAttribute('mock-json', model.mockJson);
    }
    if (model.rawYaml) {
      modelPage.setAttribute('raw-yaml', model.rawYaml);
    }
    if (model.schemaRawYaml) {
      modelPage.setAttribute('schema-raw-yaml', model.schemaRawYaml);
    }
    if (model.schemaRawJson) {
      modelPage.setAttribute('schema-raw-json', model.schemaRawJson);
    }
  }

  const securityScheme = document.getElementById('pp-model-security-scheme');
  if (securityScheme) {
    securityScheme.setAttribute('scheme-json', model.schemaJson);
  }
}

function notifyHydrationComplete() {
  document.dispatchEvent(new CustomEvent('pp:hydrated'));
}

export async function hydratePrintingPressPage() {
  const sharedAssetBase = getBodyData('ppShared');
  const pageAssetBase = getBodyData('ppPage');

  const sharedTask = loadHydrationPayload(sharedAssetBase, sharedGlobalName, 'shared')
    .then((payload) => {
      applyHydrationPayload(payload);
      return payload;
    });

  const pageTask = loadHydrationPayload(pageAssetBase, pageGlobalName, 'page')
    .then((payload) => {
      applyHydrationPayload(payload, {includeModel: false});
      return payload;
    });

  const [sharedResult, pageResult] = await Promise.allSettled([sharedTask, pageTask]);
  const results = [sharedResult, pageResult];
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('printing-press hydration failed', result.reason);
    }
  }

  if (pageResult.status === 'fulfilled' && pageResult.value?.model) {
    applyModelPayload(pageResult.value.model);
  }

  notifyHydrationComplete();
}
