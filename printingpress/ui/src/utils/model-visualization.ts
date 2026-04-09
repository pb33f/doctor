import {getBodyData, loadAsset} from './asset-loader.js';

interface HydrationChild {
  tag: 'script' | 'template';
  type?: string;
  id?: string;
  class?: string;
  text?: string;
  html?: string;
}

interface VisualizationPayload {
  children?: Record<string, HydrationChild[]>;
}

const graphVizGlobalName = '__PP_VIZ_GRAPH_DATA__';
const diagramVizGlobalName = '__PP_VIZ_DIAGRAM_DATA__';
let graphVizPayloadPromise: Promise<VisualizationPayload | null> | null = null;
let diagramVizPayloadPromise: Promise<VisualizationPayload | null> | null = null;

export async function ensureModelGraphVisualization(targetID: string): Promise<boolean> {
  return ensureModelVisualization(targetID, 'ppVizGraph', graphVizGlobalName, 'graph');
}

export async function ensureModelDiagramVisualization(targetID: string): Promise<boolean> {
  return ensureModelVisualization(targetID, 'ppVizDiagram', diagramVizGlobalName, 'diagram');
}

async function ensureModelVisualization(
  targetID: string,
  bodyDataKey: string,
  globalName: string,
  assetKind: 'graph' | 'diagram',
): Promise<boolean> {
  const target = document.getElementById(targetID);
  if (!target) return false;

  if (target.querySelector(':scope > [data-pp-hydrated="true"]')) {
    return true;
  }

  const payload = await loadVisualizationPayload(bodyDataKey, globalName, assetKind);
  const children = payload?.children?.[targetID];
  if (!children?.length) return false;

  removeHydratedChildren(target);
  for (const child of children) {
    target.appendChild(createHydratedChild(child));
  }
  return true;
}

async function loadVisualizationPayload(
  bodyDataKey: string,
  globalName: string,
  assetKind: 'graph' | 'diagram',
): Promise<VisualizationPayload | null> {
  if (assetKind === 'graph') {
    if (!graphVizPayloadPromise) {
      const assetBase = getBodyData(bodyDataKey);
      graphVizPayloadPromise = loadAsset<VisualizationPayload>(assetBase, globalName);
    }
    return graphVizPayloadPromise;
  }
  if (!diagramVizPayloadPromise) {
    const assetBase = getBodyData(bodyDataKey);
    diagramVizPayloadPromise = loadAsset<VisualizationPayload>(assetBase, globalName);
  }
  return diagramVizPayloadPromise;
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
