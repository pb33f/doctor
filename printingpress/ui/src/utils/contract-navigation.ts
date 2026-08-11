export interface SiteVersionLink {
    label: string;
    href: string;
    active: boolean;
}

export interface SiteContractLink {
    id: string;
    label: string;
    specKind: string;
    href: string;
    active: boolean;
    currentVersion?: string;
    versions: SiteVersionLink[];
}

export interface SiteContractGroup {
    role: string;
    label: string;
    contracts: SiteContractLink[];
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim() !== '';
}

function parsePayload(raw: unknown): unknown {
    if (typeof raw !== 'string') {
        return raw;
    }
    if (raw.trim() === '') {
        return [];
    }
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function normalizeVersions(raw: unknown, currentVersion?: string): SiteVersionLink[] {
    if (!Array.isArray(raw)) {
        return [];
    }
    const versions = raw.flatMap((entry): SiteVersionLink[] => {
        if (!entry || typeof entry !== 'object') {
            return [];
        }
        const version = entry as Record<string, unknown>;
        if (!isNonEmptyString(version.label) || !isNonEmptyString(version.href)) {
            return [];
        }
        return [{
            label: version.label,
            href: version.href,
            active: version.active === true,
        }];
    });
    if (!versions.length) {
        return versions;
    }

    let currentIndex = versions.findIndex((version) => version.active);
    if (currentIndex < 0 && currentVersion) {
        currentIndex = versions.findIndex((version) => version.label === currentVersion);
    }
    if (currentIndex < 0) {
        currentIndex = 0;
    }
    return versions.map((version, index) => ({
        ...version,
        active: index === currentIndex,
    }));
}

export function normalizeContractGroups(raw: unknown): SiteContractGroup[] {
    const parsed = parsePayload(raw);
    if (!Array.isArray(parsed)) {
        return [];
    }
    return parsed.flatMap((entry): SiteContractGroup[] => {
        if (!entry || typeof entry !== 'object') {
            return [];
        }
        const group = entry as Record<string, unknown>;
        if (!isNonEmptyString(group.role) || !isNonEmptyString(group.label) || !Array.isArray(group.contracts)) {
            return [];
        }

        const contracts = group.contracts.flatMap((entry): SiteContractLink[] => {
            if (!entry || typeof entry !== 'object') {
                return [];
            }
            const contract = entry as Record<string, unknown>;
            if (!isNonEmptyString(contract.id) || !isNonEmptyString(contract.label) ||
                !isNonEmptyString(contract.specKind) || !isNonEmptyString(contract.href)) {
                return [];
            }
            const requestedVersion = isNonEmptyString(contract.currentVersion) ? contract.currentVersion : undefined;
            const versions = normalizeVersions(contract.versions, requestedVersion);
            const selectedVersion = versions.find((version) => version.active);
            return [{
                id: contract.id,
                label: contract.label,
                specKind: contract.specKind,
                href: contract.href,
                active: contract.active === true,
                currentVersion: selectedVersion?.label ?? requestedVersion,
                versions,
            }];
        });
        return contracts.length ? [{role: group.role, label: group.label, contracts}] : [];
    });
}

export function multiContractGroups(raw: unknown): SiteContractGroup[] {
    const groups = normalizeContractGroups(raw);
    const count = groups.reduce((total, group) => total + group.contracts.length, 0);
    return count > 1 ? groups : [];
}
