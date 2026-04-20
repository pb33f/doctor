import {setSchemaRegistryEntries, type RegistryEntry} from './schema-registry.js';
import {getBodyData, loadAsset} from './asset-loader.js';
import {CreateBagManager, type Bag, type BagManager} from '@pb33f/saddlebag';

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

interface SharedHydrationCacheEntry {
  hash: string;
  payload: HydrationPayload;
}

const sharedBagEntryKey = 'shared-payload';
const sharedBagPrefix = 'printing-press:shared:';
const saddlebagDBName = 'saddlebag';
const saddlebagStoreName = 'bags';
let sharedBagManagerPromise: Promise<BagManager | null> | null = null;
let saddlebagReadyPromise: Promise<boolean> | null = null;

function logPerf(stage: string, detail?: unknown) {
  const logger = (globalThis as Record<string, unknown>).__PP_LOG as ((stage: string, detail?: unknown) => void) | undefined;
  if (typeof logger === 'function') {
    logger(stage, detail);
  }
}

function getBootstrapStore(): BootstrapStore | null {
  return (globalThis as Record<string, unknown>).__PP_BOOTSTRAP__ as BootstrapStore || null;
}

function getOrCreateBootstrapStore(): BootstrapStore {
  const root = globalThis as Record<string, unknown>;
  const existing = root.__PP_BOOTSTRAP__ as BootstrapStore | undefined;
  if (existing) {
    return existing;
  }
  const created: BootstrapStore = {};
  root.__PP_BOOTSTRAP__ = created;
  return created;
}

function shouldHoldNavPreview(): boolean {
  const store = getBootstrapStore() as (BootstrapStore & {stopAtPreview?: boolean}) | null;
  return store?.stopAtPreview === true;
}

async function loadHydrationPayload(assetBase: string, globalName: string, kind: 'shared' | 'page'): Promise<HydrationPayload | null> {
  const store = getBootstrapStore();
  const pending = kind === 'shared' ? store?.sharedPromise : store?.pagePromise;
  if (pending) {
    logPerf(`${kind}-payload:await-bootstrap-promise`, {assetBase});
    try {
      const resolved = await pending;
      if (resolved) {
        logPerf(`${kind}-payload:resolved-from-bootstrap-promise`, {assetBase, hasPayload: true});
        return resolved;
      }
      logPerf(`${kind}-payload:bootstrap-promise-empty`, {assetBase});
    } catch {
      const cached = store?.[kind];
      if (cached) {
        logPerf(`${kind}-payload:bootstrap-promise-failed-using-store`, {assetBase});
        return cached || null;
      }
      logPerf(`${kind}-payload:bootstrap-promise-failed`, {assetBase});
    }
  }

  if (store?.[kind]) {
    logPerf(`${kind}-payload:resolved-from-store`, {assetBase});
    return store[kind] || null;
  }

  logPerf(`${kind}-payload:load-asset:start`, {assetBase});
  const payload = await loadAsset<HydrationPayload>(assetBase, globalName);
  logPerf(`${kind}-payload:load-asset:done`, {assetBase, hasPayload: !!payload});
  return payload;
}

function sharedBagID(assetBase: string): string {
  try {
    return `${sharedBagPrefix}${new URL(assetBase, document.baseURI).href}`;
  } catch {
    return `${sharedBagPrefix}${assetBase}`;
  }
}

function openSaddlebagDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(saddlebagDBName, 1);
      request.onerror = () => resolve(null);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(saddlebagStoreName)) {
          db.createObjectStore(saddlebagStoreName);
        }
      };
      request.onsuccess = () => resolve(request.result);
    } catch {
      resolve(null);
    }
  });
}

function deleteSaddlebagDB(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.deleteDatabase(saddlebagDBName);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function ensureSaddlebagStore(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') {
    logPerf('shared-cache:indexeddb-unavailable');
    return false;
  }

  if (!saddlebagReadyPromise) {
    saddlebagReadyPromise = (async () => {
      let db = await openSaddlebagDB();
      if (!db) {
        logPerf('shared-cache:db-open-failed');
        return false;
      }
      if (db.objectStoreNames.contains(saddlebagStoreName)) {
        db.close();
        logPerf('shared-cache:db-ready');
        return true;
      }
      db.close();
      logPerf('shared-cache:missing-store-reset');
      await deleteSaddlebagDB();
      db = await openSaddlebagDB();
      if (!db) {
        logPerf('shared-cache:db-reopen-failed');
        return false;
      }
      const ready = db.objectStoreNames.contains(saddlebagStoreName);
      db.close();
      logPerf('shared-cache:db-reset-result', {ready});
      return ready;
    })();
  }

  const ready = await saddlebagReadyPromise;
  if (!ready) {
    saddlebagReadyPromise = null;
  }
  return ready;
}

async function getSharedHydrationBag(assetBase: string): Promise<Bag<SharedHydrationCacheEntry> | null> {
  if (!assetBase || !(await ensureSaddlebagStore())) {
    logPerf('shared-cache:bag-unavailable', {assetBase});
    return null;
  }

  if (!sharedBagManagerPromise) {
    sharedBagManagerPromise = (async () => {
      try {
        const manager = CreateBagManager(true);
        await manager.loadStatefulBags();
        logPerf('shared-cache:bag-manager-ready');
        return manager;
      } catch {
        logPerf('shared-cache:bag-manager-failed');
        return null;
      }
    })();
  }

  const manager = await sharedBagManagerPromise;
  return manager?.getBag<SharedHydrationCacheEntry>(sharedBagID(assetBase)) ?? null;
}

async function readCachedSharedHydrationPayload(assetBase: string, expectedHash: string): Promise<HydrationPayload | null> {
  if (!assetBase || !expectedHash) {
    return null;
  }

  const bag = await getSharedHydrationBag(assetBase);
  const entry = bag?.get(sharedBagEntryKey);
  if (!entry) {
    logPerf('shared-cache:miss', {assetBase});
    return null;
  }
  if (entry.hash !== expectedHash) {
    bag?.reset();
    logPerf('shared-cache:stale', {assetBase, cachedHash: entry.hash, expectedHash});
    return null;
  }
  logPerf('shared-cache:hit', {assetBase});
  return entry.payload ?? null;
}

async function writeCachedSharedHydrationPayload(
  assetBase: string,
  expectedHash: string,
  payload: HydrationPayload | null,
): Promise<void> {
  if (!assetBase || !expectedHash || !payload) {
    return;
  }
  const bag = await getSharedHydrationBag(assetBase);
  bag?.set(sharedBagEntryKey, {hash: expectedHash, payload});
  logPerf('shared-cache:write', {assetBase, expectedHash});
}

function applyAttributes(attributes: Record<string, Record<string, string>>) {
  for (const [targetID, attrs] of Object.entries(attributes)) {
    const el = document.getElementById(targetID);
    if (!el) continue;
    for (const [name, value] of Object.entries(attrs)) {
      el.setAttribute(name, value);
    }
    if (targetID === 'pp-nav') {
      logPerf('nav-attributes:applied', {
        nav: Boolean(attrs['data-nav']),
        models: Boolean(attrs['data-models']),
        webhooks: Boolean(attrs['data-webhooks']),
      });
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
  if (shouldHoldNavPreview()) {
    logPerf('hydrate:skipped', {reason: 'preview-hold'});
    return;
  }
  const sharedAssetBase = getBodyData('ppShared');
  const sharedHash = getBodyData('ppSharedHash');
  const pageAssetBase = getBodyData('ppPage');
  const bootstrapStore = getBootstrapStore();
  logPerf('hydrate:start', {
    sharedAssetBase,
    pageAssetBase,
    hasBootstrapShared: Boolean(bootstrapStore?.shared),
    hasBootstrapSharedPromise: Boolean(bootstrapStore?.sharedPromise),
  });
  const cachedSharedPayload = bootstrapStore?.shared || (!bootstrapStore?.sharedPromise
    ? await readCachedSharedHydrationPayload(sharedAssetBase, sharedHash)
    : null);
  if (cachedSharedPayload && !bootstrapStore?.shared) {
    getOrCreateBootstrapStore().shared = cachedSharedPayload;
    logPerf('shared-cache:seeded-bootstrap-store');
  }

  const sharedTask = loadHydrationPayload(sharedAssetBase, sharedGlobalName, 'shared')
    .then(async (payload) => {
      if (!cachedSharedPayload) {
        await writeCachedSharedHydrationPayload(sharedAssetBase, sharedHash, payload);
      }
      applyHydrationPayload(payload);
      logPerf('shared-payload:applied', {hasPayload: !!payload});
      return payload;
    });

  const pageTask = loadHydrationPayload(pageAssetBase, pageGlobalName, 'page')
    .then(async (payload) => {
      try {
        await sharedTask;
      } catch {
        // Let page-specific hydration proceed even if the shared payload failed.
      }
      applyHydrationPayload(payload, {includeModel: false});
      logPerf('page-payload:applied', {hasPayload: !!payload});
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
    logPerf('model-payload:applied');
  }

  logPerf('hydrate:complete');
  notifyHydrationComplete();
}
