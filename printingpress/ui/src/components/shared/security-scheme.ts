import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import sharedCss from '../../styles/shared.css.ts';
import styles from './security-scheme.css.js';

const flowDisplayNames: Record<string, string> = {
    implicit: 'IMPLICIT',
    authorizationCode: 'AUTHORIZATION CODE',
    clientCredentials: 'CLIENT CREDENTIALS',
    password: 'PASSWORD',
};

function schemeIcon(type: string, inLocation?: string, scheme?: string): string {
    switch (type) {
        case 'apiKey':
            switch (inLocation) {
                case 'cookie': return 'cookie';
                case 'header': return 'envelope';
                case 'query': return 'signpost';
                default: return 'key';
            }
        case 'http':
            switch (scheme) {
                case 'bearer': return 'shield-lock';
                case 'basic': return 'person-lock';
                default: return 'lock';
            }
        case 'oauth2': return 'key';
        case 'openIdConnect': return 'fingerprint';
        default: return 'lock';
    }
}

@customElement('pp-security-scheme')
export class PpSecurityScheme extends LitElement {
    static styles = [sharedCss, styles];

    @property({attribute: 'scheme-json'}) schemeJson = '';
    @state() private scheme: any = null;

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has('schemeJson') && this.schemeJson) {
            try {
                this.scheme = JSON.parse(this.schemeJson);
            } catch {
                this.scheme = null;
            }
        }
    }

    private renderProperty(name: string, value: string) {
        return html`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">${name}</span></div>
                <div class="prop-type-col"><span class="prop-type">${value}</span></div>
            </div>
        `;
    }

    private renderTypeProperty(type: string, iconName: string) {
        return html`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">type</span></div>
                <div class="prop-type-col">
                    <sl-icon name=${iconName} class="type-icon"></sl-icon>
                    <span class="prop-type">${type.toUpperCase()}</span>
                </div>
            </div>
        `;
    }

    private renderUrlProperty(name: string, url: string) {
        return html`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">${name}</span></div>
                <div class="prop-type-col">
                    <a class="url-link" href=${url} target="_blank" rel="noopener noreferrer">${url}</a>
                </div>
            </div>
        `;
    }

    private renderScopes(scopes: Record<string, string>) {
        const entries = Object.entries(scopes);
        if (entries.length === 0) return nothing;

        return html`
            <div class="scopes-section">
                <div class="property scope-header">
                    <div class="prop-name-col"><span class="scope-heading">SCOPES</span></div>
                    <div class="prop-type-col"></div>
                </div>
                ${entries.map(([name, desc]) => html`
                    <div class="property scope-row">
                        <div class="prop-name-col"><code class="scope-name">${name}</code></div>
                        <div class="prop-type-col"><span class="scope-desc">${desc}</span></div>
                    </div>
                `)}
            </div>
        `;
    }

    private renderFlow(flowKey: string, flow: any) {
        if (!flow) return nothing;

        const heading = flowDisplayNames[flowKey] || flowKey.toUpperCase();

        return html`
            <div class="flow-section">
                <div class="flow-heading">${heading}</div>
                ${flow.authorizationUrl ? this.renderUrlProperty('authorizationUrl', flow.authorizationUrl) : nothing}
                ${flow.tokenUrl ? this.renderUrlProperty('tokenUrl', flow.tokenUrl) : nothing}
                ${flow.refreshUrl ? this.renderUrlProperty('refreshUrl', flow.refreshUrl) : nothing}
                ${flow.scopes && Object.keys(flow.scopes).length > 0 ? this.renderScopes(flow.scopes) : nothing}
            </div>
        `;
    }

    private renderFlows(flows: any) {
        if (!flows || typeof flows !== 'object') return nothing;

        const flowKeys = Object.keys(flows);
        if (flowKeys.length === 0) return nothing;

        return flowKeys.map(key => this.renderFlow(key, flows[key]));
    }

    render() {
        if (!this.scheme) return nothing;

        const {type, name, scheme, bearerFormat, openIdConnectUrl, flows} = this.scheme;
        const iconName = schemeIcon(type, this.scheme.in, scheme);

        return html`
            <div class="scheme-properties">
                ${type ? this.renderTypeProperty(type, iconName) : nothing}
                ${name ? this.renderProperty('name', name) : nothing}
                ${this.scheme.in ? this.renderProperty('in', this.scheme.in) : nothing}
                ${scheme ? this.renderProperty('scheme', scheme) : nothing}
                ${bearerFormat ? this.renderProperty('bearerFormat', bearerFormat) : nothing}
                ${openIdConnectUrl ? this.renderUrlProperty('openIdConnectUrl', openIdConnectUrl) : nothing}
                ${type === 'oauth2' ? this.renderFlows(flows) : nothing}
            </div>
        `;
    }
}
