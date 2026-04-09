import {loadAsset} from './asset-loader.js';

export interface RegistryEntry {
    name: string;
    componentType: string;
    description?: string;
    typeSlug: string;
    slug: string;
    href: string;
    pageDataBase: string;
    hasExample?: boolean;
}

export interface CanonicalModelData {
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
}

interface ModelAssetPayload {
    model?: CanonicalModelData;
}

const registry: Map<string, RegistryEntry> = new Map();
const modelCache: Map<string, CanonicalModelData> = new Map();
const pageGlobalName = '__PP_PAGE_DATA__';

export function setSchemaRegistryEntries(data: Record<string, RegistryEntry>) {
    registry.clear();
    for (const [key, entry] of Object.entries(data)) {
        registry.set(key, entry);
    }
}

export function getSchemaEntry(key: string): RegistryEntry | undefined {
    return registry.get(key);
}

export function getSchemaEntryByRef(ref: string): RegistryEntry | undefined {
    if (!ref?.startsWith('#/components/')) return undefined;
    const key = ref.replace('#/components/', '');
    return getSchemaEntry(key);
}

export function getCachedSchemaModel(key: string): CanonicalModelData | undefined {
    return modelCache.get(key);
}

export function getCachedSchemaModelByRef(ref: string): CanonicalModelData | undefined {
    if (!ref?.startsWith('#/components/')) return undefined;
    return getCachedSchemaModel(ref.replace('#/components/', ''));
}

export async function loadSchemaModel(key: string): Promise<CanonicalModelData | undefined> {
    const cached = modelCache.get(key);
    if (cached) return cached;

    const entry = getSchemaEntry(key);
    if (!entry?.pageDataBase) return undefined;

    const payload = await loadAsset<ModelAssetPayload>(entry.pageDataBase, pageGlobalName);
    if (!payload?.model) return undefined;

    modelCache.set(key, payload.model);
    return payload.model;
}

export async function loadSchemaModelByRef(ref: string): Promise<CanonicalModelData | undefined> {
    if (!ref?.startsWith('#/components/')) return undefined;
    return loadSchemaModel(ref.replace('#/components/', ''));
}

export async function preloadSchemaReferences(schema: any, visited = new Set<string>()): Promise<void> {
    const refs = collectSchemaRefs(schema);
    for (const ref of refs) {
        if (visited.has(ref)) continue;
        visited.add(ref);
        const model = await loadSchemaModelByRef(ref);
        if (!model?.schemaJson) continue;
        try {
            const parsed = JSON.parse(model.schemaJson);
            await preloadSchemaReferences(parsed, visited);
        } catch {
            // ignore malformed cached schema
        }
    }
}

function collectSchemaRefs(value: any, refs = new Set<string>()): Set<string> {
    if (!value || typeof value !== 'object') return refs;
    if (Array.isArray(value)) {
        for (const item of value) collectSchemaRefs(item, refs);
        return refs;
    }
    if (typeof value.$ref === 'string') {
        refs.add(value.$ref);
    }
    for (const child of Object.values(value)) {
        collectSchemaRefs(child, refs);
    }
    return refs;
}

/** @internal test-only: reset the registry so a fresh fixture can be injected */
export function resetRegistry() {
    registry.clear();
    modelCache.clear();
}

/** @internal test-only: seed canonical model payloads without fetching assets */
export function seedCachedSchemaModels(data: Record<string, CanonicalModelData>) {
    modelCache.clear();
    for (const [key, model] of Object.entries(data)) {
        modelCache.set(key, model);
    }
}
