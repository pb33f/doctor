import {getBodyData} from './asset-loader.js';
import type {ViolationCounts} from './violations.js';

export interface PageProblem {
  category: string;
  jsonPath: string;
  endColumn: number;
  endLineNumber: number;
  message: string;
  severity: number;
  startColumn: number;
  startLineNumber: number;
  source: string;
  id: string;
  sourceLocation: string;
  pageHref?: string;
  pageTitle?: string;
  pageKind?: string;
  pageMethod?: string;
  pagePath?: string;
  pageOperationId?: string;
  pageComponent?: string;
  sliceKey?: string;
}

export interface YamlSliceData {
  key: string;
  file: string;
  firstLine: number;
  source: string;
}

export interface ProblemMetadata {
  sliceKey?: string;
  pageHref?: string;
  pageTitle?: string;
  pageKind?: string;
  pageMethod?: string;
  pagePath?: string;
  pageOperationId?: string;
  pageComponent?: string;
}

export interface PageDeveloperPayload {
  counts: ViolationCounts;
  siteCounts?: ViolationCounts;
  problems: PageProblem[];
  slices: Record<string, YamlSliceData>;
  metadata: Record<string, ProblemMetadata>;
  orphanCount?: number;
}

interface HydrationPayload {
  developer?: Partial<PageDeveloperPayload>;
}

interface BootstrapStore {
  page?: HydrationPayload | null;
}

function bootstrapPage(): HydrationPayload | null {
  const store = (globalThis as Record<string, unknown>).__PP_BOOTSTRAP__ as BootstrapStore | undefined;
  return store?.page || null;
}

function normalizeDeveloperPayload(raw: Partial<PageDeveloperPayload> | undefined): PageDeveloperPayload | null {
  if (!raw) return null;
  return {
    counts: raw.counts || {errors: 0, warns: 0, infos: 0},
    siteCounts: raw.siteCounts,
    problems: raw.problems || [],
    slices: raw.slices || {},
    metadata: raw.metadata || {},
    orphanCount: raw.orphanCount || 0,
  };
}

export async function getPageDeveloperPayload(): Promise<PageDeveloperPayload | null> {
  if (getBodyData('ppDeveloperMode') !== 'true') {
    return null;
  }

  const page = bootstrapPage();
  if (page) {
    return normalizeDeveloperPayload(page.developer);
  }

  await new Promise<void>((resolve) => {
    document.addEventListener('pp:hydrated', () => resolve(), {once: true});
  });
  return normalizeDeveloperPayload(bootstrapPage()?.developer);
}
