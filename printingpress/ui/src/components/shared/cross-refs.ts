import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import crossRefsCss from './cross-refs.css.js';

interface CrossRefData {
  UsedByOperations?: {Method: string; Path: string; Slug: string}[];
  UsedByModels?: {Name: string; ComponentType: string; Slug: string}[];
  UsesModels?: {Name: string; ComponentType: string; Slug: string}[];
}

@customElement('pp-cross-refs')
export class PpCrossRefs extends LitElement {
  static styles = crossRefsCss;

  @property({attribute: 'refs-json'}) refsJson = '';
  @state() private refs: CrossRefData = {};

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('refsJson') && this.refsJson) {
      try {
        this.refs = JSON.parse(this.refsJson);
      } catch {
        this.refs = {};
      }
    }
  }

  render() {
    const {refs} = this;
    const hasRefs =
      refs.UsedByOperations?.length ||
      refs.UsedByModels?.length ||
      refs.UsesModels?.length;
    if (!hasRefs) return nothing;

    return html`
      ${refs.UsedByOperations?.length
        ? html`
            <h3>Used by Operations</h3>
            <ul>
              ${refs.UsedByOperations.map(
                (op) => html`
                  <li>
                    <a href="../../operations/${op.Slug}.html">
                      <pb33f-http-method method=${op.Method}></pb33f-http-method>
                      ${op.Path}
                    </a>
                  </li>
                `
              )}
            </ul>
          `
        : nothing}
      ${refs.UsedByModels?.length
        ? html`
            <h3>Referenced by</h3>
            <ul>
              ${refs.UsedByModels.map(
                (comp) => html`
                  <li>
                    <a href="../${comp.ComponentType}/${comp.Slug}.html">
                      ${comp.Name}
                    </a>
                    <span class="type-badge">${comp.ComponentType}</span>
                  </li>
                `
              )}
            </ul>
          `
        : nothing}
      ${refs.UsesModels?.length
        ? html`
            <h3>References</h3>
            <ul>
              ${refs.UsesModels.map(
                (comp) => html`
                  <li>
                    <a href="../${comp.ComponentType}/${comp.Slug}.html">
                      ${comp.Name}
                    </a>
                    <span class="type-badge">${comp.ComponentType}</span>
                  </li>
                `
              )}
            </ul>
          `
        : nothing}
    `;
  }
}
