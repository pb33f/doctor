const SCHEME_HREF_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

function isLiteralHref(href: string): boolean {
    return !href
        || href.startsWith('/')
        || href.startsWith('#')
        || href.startsWith('data:')
        || SCHEME_HREF_RE.test(href);
}

function currentDocBase(): string {
    const configuredBase = document.body?.dataset.ppBaseUrl;
    if (!configuredBase) {
        return document.baseURI;
    }
    try {
        return new URL(configuredBase, window.location.href).toString();
    } catch {
        return document.baseURI;
    }
}

export function docHref(href: string): string {
    if (isLiteralHref(href)) {
        return href;
    }
    try {
        return new URL(href, currentDocBase()).toString();
    } catch {
        return href;
    }
}

export function overviewHref(): string {
    const configuredOverview = document.body?.dataset.ppOverviewHref;
    if (configuredOverview) {
        return docHref(configuredOverview);
    }
    return docHref('index.html');
}

export function headerTitleHref(): string {
    const configuredCatalog = document.body?.dataset.ppCatalogHref;
    if (configuredCatalog) {
        return docHref(configuredCatalog);
    }
    return overviewHref();
}

export function operationHref(slug: string): string {
    return docHref(`operations/${slug}.html`);
}

export function modelHref(typeSlug: string, slug: string): string {
    return docHref(`models/${typeSlug}/${slug}.html`);
}
