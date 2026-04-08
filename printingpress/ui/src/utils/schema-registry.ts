export interface RegistryEntry {
    name: string;
    componentType: string;
    description?: string;
    schemaJson: string;
    mockJson?: string;
}

const registry: Map<string, RegistryEntry> = new Map();
let initialized = false;

function init() {
    if (initialized) return;
    const el = document.getElementById('pp-schema-registry');
    if (!el?.textContent) return;
    try {
        setSchemaRegistryEntries(JSON.parse(el.textContent) as Record<string, RegistryEntry>);
    } catch { /* empty registry is fine */ }
}

export function setSchemaRegistryEntries(data: Record<string, RegistryEntry>) {
    registry.clear();
    for (const [key, entry] of Object.entries(data)) {
        registry.set(key, entry);
    }
    initialized = true;
}

export function getSchemaEntry(key: string): RegistryEntry | undefined {
    init();
    return registry.get(key);
}

export function getSchemaEntryByRef(ref: string): RegistryEntry | undefined {
    if (!ref?.startsWith('#/components/')) return undefined;
    const key = ref.replace('#/components/', '');
    return getSchemaEntry(key);
}

/** @internal test-only: reset the registry so a fresh fixture can be injected */
export function resetRegistry() {
    registry.clear();
    initialized = false;
}
