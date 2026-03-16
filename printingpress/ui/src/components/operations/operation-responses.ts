import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.js';
import operationResponsesCss from './operation-responses.css.js';
import detailsCss from '../../styles/details.css.js';
import '../shared/code-viewer.js';
import '../shared/schema-properties.js';
import {ComponentLinkData} from '../../utils/schema.js';

interface MediaTypeData {
  mediaType: string;
  schemaJson: string;
  mockJson?: string;
  examples?: Record<string, string>;
  schemaRef?: ComponentLinkData;
  isArray?: boolean;
  itemsRef?: ComponentLinkData;
}

interface HeaderData {
  name: string;
  description?: string;
  schemaType?: string;
  ref?: ComponentLinkData;
  example?: string;
  minimum?: number;
  maximum?: number;
  default?: string;
  enum?: string[];
  pattern?: string;
}

interface ResponseData {
  statusCode: string;
  description: string;
  content?: MediaTypeData[];
  headers?: HeaderData[];
  ref?: ComponentLinkData;
  rawJson?: string;
  rawYaml?: string;
  sourceLine?: number;
}

@customElement('pp-operation-responses')
export class PpOperationResponses extends LitElement {
  static styles = [sharedCss, operationResponsesCss, detailsCss];

  @property({attribute: 'responses-json'}) responsesJson = '';
  @property({attribute: 'common-headers-json'}) commonHeadersJson = '';
  @state() private responses: ResponseData[] = [];
  @state() private commonResponseHeaders: HeaderData[] = [];
  @state() private commonHeaderNames = new Set<string>();
  @state() private commonErrorKeys = new Set<string>();
  @state() private commonErrorResponses = new Map<string, { resp: ResponseData; codeDescs: Array<{code: string; description: string}> }>();

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('responsesJson') && this.responsesJson) {
      try {
        this.responses = JSON.parse(this.responsesJson);
      } catch {
        this.responses = [];
      }
      const { commonNames } = this.computeCommonHeaders();
      this.commonHeaderNames = commonNames;

      const sorted = [...this.responses].sort((a, b) => parseInt(a.statusCode, 10) - parseInt(b.statusCode, 10));
      const errors = sorted.filter(r => parseInt(r.statusCode, 10) >= 400);
      const { commonKeys, commonResponses } = this.computeCommonErrors(errors);
      this.commonErrorKeys = commonKeys;
      this.commonErrorResponses = commonResponses;
    }
    if (changed.has('commonHeadersJson') && this.commonHeadersJson) {
      try {
        this.commonResponseHeaders = JSON.parse(this.commonHeadersJson);
      } catch {
        this.commonResponseHeaders = [];
      }
    }
  }

  private renderRefLink(ref: ComponentLinkData) {
    return html`<a class="ref-link" href="models/${ref.typeSlug}/${ref.slug}.html">\u279c ${ref.name}</a>`;
  }

  private renderInlineExamples(mt: MediaTypeData) {
    const entries: Array<{key: string; json: string}> = [];
    if (mt.examples) {
      for (const [key, json] of Object.entries(mt.examples)) {
        if (json) entries.push({key, json});
      }
    }
    if (mt.mockJson) {
      entries.push({key: 'Generated Example', json: mt.mockJson});
    }
    if (!entries.length) return nothing;
    return entries.map(entry => {
      let formatted = entry.json;
      try { formatted = JSON.stringify(JSON.parse(entry.json), null, 2); } catch { /* use as-is */ }
      return html`
        <div class="inline-example">
          <div class="inline-example-label">${entry.key}</div>
          <pp-code-viewer
            .code=${formatted}
            language="json">
          </pp-code-viewer>
        </div>
      `;
    });
  }

  private renderMediaType(mt: MediaTypeData) {
    if (mt.isArray && mt.itemsRef) {
      return html`
        <div class="media-type-ref">
          <span class="media-type-label">${mt.mediaType}</span>
          <span class="array-type">Array&lt;${this.renderRefLink(mt.itemsRef)}&gt;</span>
        </div>
        ${mt.schemaJson ? html`<pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>` : nothing}
        ${this.renderInlineExamples(mt)}
      `;
    }
    if (mt.schemaRef) {
      return html`
        <div class="media-type-ref">
          <span class="media-type-label">${mt.mediaType}</span>
          ${this.renderRefLink(mt.schemaRef)}
        </div>
        ${mt.schemaJson ? html`<pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>` : nothing}
        ${this.renderInlineExamples(mt)}
      `;
    }
    if (!mt.schemaJson) return nothing;
    return html`
      <div class="media-type-label">${mt.mediaType}</div>
      <pp-schema-properties schema-json=${mt.schemaJson}></pp-schema-properties>
      ${this.renderInlineExamples(mt)}
    `;
  }

  private computeCommonHeaders(): { common: HeaderData[], commonNames: Set<string> } {
    const counts = new Map<string, number>();
    const first = new Map<string, HeaderData>();
    for (const resp of this.responses) {
      for (const h of resp.headers ?? []) {
        counts.set(h.name, (counts.get(h.name) ?? 0) + 1);
        if (!first.has(h.name)) first.set(h.name, h);
      }
    }
    const common: HeaderData[] = [];
    const commonNames = new Set<string>();
    for (const [name, count] of counts) {
      if (count >= 2) {
        common.push(first.get(name)!);
        commonNames.add(name);
      }
    }
    return { common, commonNames };
  }

  private scrollToHeader(name: string) {
    const el = document.getElementById('header-' + name);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private renderHeaderConstraints(h: HeaderData) {
    const has = h.example !== undefined || h.minimum !== undefined || h.maximum !== undefined
      || h.default !== undefined || h.pattern || h.enum?.length;
    if (!has) return nothing;
    return html`
      <div class="header-constraints">
        ${h.example !== undefined ? html`<span class="constraint-label">example</span><span class="constraint-value">${h.example}</span>` : nothing}
        ${h.default !== undefined ? html`<span class="constraint-label">default</span><span class="constraint-value">${h.default}</span>` : nothing}
        ${h.minimum !== undefined ? html`<span class="constraint-label">min</span><span class="constraint-value">${h.minimum}</span>` : nothing}
        ${h.maximum !== undefined ? html`<span class="constraint-label">max</span><span class="constraint-value">${h.maximum}</span>` : nothing}
        ${h.pattern ? html`<span class="constraint-label">pattern</span><span class="constraint-value"><code>${h.pattern}</code></span>` : nothing}
        ${h.enum?.length ? html`<span class="constraint-label">enum</span><span class="constraint-value">${h.enum.map((v, i) => html`${i > 0 ? ', ' : ''}<span class="enum-value">${v}</span>`)}</span>` : nothing}
      </div>
    `;
  }

  private renderHeaderEntry(h: HeaderData) {
    return html`
      <div class="header-entry">
        ${h.ref
          ? html`<a class="ref-link header-name" href="models/${h.ref.typeSlug}/${h.ref.slug}.html">\u279c ${h.name}</a>`
          : html`<span class="header-name">${h.name}</span>`}
        ${h.schemaType ? html`<span class="header-type">${h.schemaType}</span>` : nothing}
        ${h.description ? html`<div class="header-desc">${h.description}</div>` : nothing}
        ${this.renderHeaderConstraints(h)}
      </div>
    `;
  }

  private renderHeaders(headers: HeaderData[], commonNames: Set<string>) {
    if (!headers || !headers.length) return nothing;
    const unique = headers.filter(h => !commonNames.has(h.name));
    const common = headers.filter(h => commonNames.has(h.name));
    if (!unique.length && !common.length) return nothing;
    return html`
      <div class="headers-section">
        <div class="headers-label">Headers</div>
        ${common.length ? html`
          <div class="common-header-grid">
            <div class="common-link-label">\u2191 common</div>
            ${common.map(h => html`
              <a class="header-anchor" @click=${(e: Event) => { e.preventDefault(); this.scrollToHeader(h.name); }}>${h.name}</a>
              <span class="common-header-desc">${h.description || ''}</span>
            `)}
          </div>
        ` : nothing}
        ${unique.map(h => this.renderHeaderEntry(h))}
      </div>
    `;
  }

  /** Get a dedup key for an error response based on its schema/response ref. */
  private errorRefKey(resp: ResponseData): string | null {
    if (resp.ref) return `ref:${resp.ref.slug}`;
    if (resp.content?.length) {
      const mt = resp.content[0];
      if (mt.schemaRef) return `schema:${mt.schemaRef.slug}`;
      if (mt.isArray && mt.itemsRef) return `items:${mt.itemsRef.slug}`;
    }
    return null;
  }

  /**
   * Find error schemas used by 2+ status codes.
   * Returns the set of common ref keys, plus one representative response per key.
   */
  private computeCommonErrors(errors: ResponseData[]): {
    commonKeys: Set<string>;
    commonResponses: Map<string, { resp: ResponseData; codeDescs: Array<{code: string; description: string}> }>;
  } {
    const counts = new Map<string, { resp: ResponseData; codeDescs: Array<{code: string; description: string}> }>();
    for (const r of errors) {
      const key = this.errorRefKey(r);
      if (!key) continue;
      const existing = counts.get(key);
      if (existing) {
        existing.codeDescs.push({ code: r.statusCode, description: r.description });
      } else {
        counts.set(key, { resp: r, codeDescs: [{ code: r.statusCode, description: r.description }] });
      }
    }
    const commonKeys = new Set<string>();
    const commonResponses = new Map<string, { resp: ResponseData; codeDescs: Array<{code: string; description: string}> }>();
    for (const [key, entry] of counts) {
      if (entry.codeDescs.length >= 2) {
        commonKeys.add(key);
        commonResponses.set(key, entry);
      }
    }
    return { commonKeys, commonResponses };
  }

  private scrollToCommonError(key: string) {
    const el = this.shadowRoot?.getElementById('common-error-' + key);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private renderResponse(resp: ResponseData, commonNames: Set<string>, commonErrorKeys?: Set<string>) {
    const errorKey = commonErrorKeys ? this.errorRefKey(resp) : null;
    const isCommonError = errorKey != null && commonErrorKeys?.has(errorKey);

    return html`
      <div class="response">
        <h4>
          <span class="status-code">${resp.statusCode}</span>
          ${resp.description}
          ${resp.rawJson || resp.rawYaml
            ? html`<pp-raw-viewer-btn
                title="Response ${resp.statusCode}"
                raw-json=${resp.rawJson || ''}
                raw-yaml=${resp.rawYaml || ''}
                start-line=${resp.sourceLine || 1}>
              </pp-raw-viewer-btn>`
            : nothing}
        </h4>
        ${isCommonError
          ? html`
              <div class="common-error-link">
                ${resp.ref ? this.renderRefLink(resp.ref) : nothing}
                ${!resp.ref && resp.content?.length ? this.renderMediaTypeHeader(resp.content[0]) : nothing}
                <a class="error-anchor" @click=${(e: Event) => { e.preventDefault(); this.scrollToCommonError(errorKey!); }}>\u2191 see common example</a>
              </div>`
          : resp.ref
            ? this.renderRefLink(resp.ref)
            : resp.content?.map(mt => this.renderMediaType(mt)) ?? nothing}
        ${this.renderHeaders(resp.headers ?? [], commonNames)}
      </div>
    `;
  }

  /** Render just the media type label + ref link without the inline example. */
  private renderMediaTypeHeader(mt: MediaTypeData) {
    if (mt.isArray && mt.itemsRef) {
      return html`
        <span class="media-type-label">${mt.mediaType}</span>
        <span class="array-type">Array&lt;${this.renderRefLink(mt.itemsRef)}&gt;</span>
      `;
    }
    if (mt.schemaRef) {
      return html`
        <span class="media-type-label">${mt.mediaType}</span>
        ${this.renderRefLink(mt.schemaRef)}
      `;
    }
    return nothing;
  }

  private renderCommonErrors(
    commonResponses: Map<string, { resp: ResponseData; codeDescs: Array<{code: string; description: string}> }>,
    commonNames: Set<string>,
  ) {
    if (!commonResponses.size) return nothing;
    return html`
      <div class="response-group-heading">Common Error Responses</div>
      ${[...commonResponses.entries()].map(([key, { resp, codeDescs }]) => html`
        <div class="response common-error-response" id="common-error-${key}">
          <div class="common-error-grid">
            ${codeDescs.map(({ code, description }) => html`
              <span class="common-error-code">${code}</span>
              <span class="common-error-desc">${description}</span>
            `)}
          </div>
          ${resp.ref
            ? this.renderRefLink(resp.ref)
            : resp.content?.map(mt => this.renderMediaType(mt)) ?? nothing}
          ${this.renderHeaders(resp.headers ?? [], commonNames)}
        </div>
      `)}
    `;
  }

  render() {
    if (!this.responses.length) return nothing;
    const commonNames = this.commonHeaderNames;

    const sorted = [...this.responses].sort((a, b) =>
      parseInt(a.statusCode, 10) - parseInt(b.statusCode, 10)
    );
    const success: ResponseData[] = [];
    const redirect: ResponseData[] = [];
    const error: ResponseData[] = [];
    for (const r of sorted) {
      const code = parseInt(r.statusCode, 10);
      if (code >= 400) {
        error.push(r);
      } else if (code >= 300) {
        redirect.push(r);
      } else {
        success.push(r);
      }
    }

    const commonKeys = this.commonErrorKeys;
    const commonResponses = this.commonErrorResponses;

    const hasErrors = error.length > 0 || commonResponses.size > 0;
    const hasRedirects = redirect.length > 0;

    return html`
      <h3>Responses</h3>
      ${success.map(r => this.renderResponse(r, commonNames))}
      ${hasRedirects ? html`
        <sl-details class="pp-details">
          <span slot="summary" class="pp-details-summary">Redirect Responses</span>
          ${redirect.map(r => this.renderResponse(r, commonNames))}
        </sl-details>
      ` : nothing}
      ${this.commonResponseHeaders.length ? html`
        <sl-details class="pp-details">
          <span slot="summary" class="pp-details-summary">Common Response Headers</span>
          ${this.commonResponseHeaders.map(h => this.renderHeaderEntry(h))}
        </sl-details>
      ` : nothing}
      ${hasErrors ? html`
        <sl-details class="pp-details">
          <span slot="summary" class="pp-details-summary">Error Responses</span>
          ${this.renderCommonErrors(commonResponses, commonNames)}
          ${error.map(r => this.renderResponse(r, commonNames, commonKeys))}
        </sl-details>
      ` : nothing}
    `;
  }
}
