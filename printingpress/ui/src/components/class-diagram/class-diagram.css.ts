import {css} from 'lit';

export default css`
    :host {
        display: block;
    }
    .diagram-wrapper {
        border-radius: 0;
        overflow: hidden;
    }
    
    h2 {
        margin-bottom: 0;
    }
    
    /* Narrow (stacked) layout */
    .diagram-area {
        border: 1px dashed var(--secondary-color);
        height: 600px;
        overflow: hidden;
    }
    .diagram-area pb33f-mermaid-renderer {
        height: 100%;
    }

    /* Toolbar (shared) */
    .toolbar {
        display: flex;
        gap: var(--global-padding);
        padding: var(--global-padding) 0 var(--global-padding) 0;
        align-items: center;
    }
    .toolbar sl-tooltip,
    .copy-source-btn,
    .code-header sl-tooltip {
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }
    .toolbar sl-tooltip::part(body),
    .code-header sl-tooltip::part(body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .copy-source-btn::part(tooltip__body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .toolbar sl-icon-button::part(base) {
        color: var(--font-color-sub1);
    }
    .toolbar sl-icon-button::part(base):hover {
        color: var(--primary-color);
    }
    .hide-toggle.hidden::part(base) {
        color: var(--error-color);
    }
    .toolbar sl-button::part(base) {
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
        gap: 0.35rem;
    }
    .toolbar sl-button::part(base):hover {
        color: var(--primary-color);
    }
    .toolbar sl-button::part(label) {
        padding: 0;
    }

    /* Narrow code section (collapsible) */
    .code-section {
        border-top: 1px dashed var(--hrcolor);
    }
    .code-section::part(header) {
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
        padding: var(--global-padding);
    }
    .code-section::part(content) {
        padding: 0;
    }

    /* Wide (split) layout */
    .diagram-split {
        border: 1px solid var(--secondary-color-lowalpha);
        height: 600px;
        --divider-width: 2px;
        --divider-hit-area: 12px;
    }
    .diagram-split::part(divider) {
        background-color: var(--secondary-color);
    }
    .diagram-split sl-icon[slot="divider"] {
        position: absolute;
        left: 2px;
        border-radius: 0;
        background: var(--secondary-color);
        color: var(--background-color);
        padding: 0;
        width: 10px;
        height: 40px;
    }
    .diagram-view {
        height: 100%;
        overflow: hidden;
    }
    .diagram-view pb33f-mermaid-renderer {
        height: 100%;
    }
    .code-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-left: 1px dashed var(--secondary-color);
        min-width: 0;
        overflow: hidden;
    }
    .code-header {
        display: flex;
        align-items: center;
        gap: var(--global-padding);
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
        padding: var(--global-padding) var(--global-padding-double);
        border-bottom: 1px dashed var(--hrcolor);
    }
    .copy-source-btn {
        margin-left: auto;
        --sl-color-primary-600: var(--primary-color);
    }
    .copy-source-btn::part(button) {
        color: var(--font-color-sub1);
    }
    .copy-source-btn::part(button):hover {
        color: var(--primary-color);
    }
    .collapse-btn::part(base) {
        color: var(--font-color-sub1);
    }
    .collapse-btn::part(base):hover {
        color: var(--primary-color);
    }

    /* Collapsed state — full-width diagram with thin tab */
    .diagram-full {
        position: relative;
        border: 1px dashed var(--secondary-color);
        height: 600px;
        overflow: hidden;
    }
    .diagram-full pb33f-mermaid-renderer {
        height: 100%;
    }
    .collapse-tab {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: var(--secondary-color);
        color: var(--background-color);
    }
    .collapse-tab:hover {
        background: var(--primary-color);
        color: var(--background-color);
    }
    .code-content {
        flex: 1;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-dimmer) transparent;
    }

    /* Shared pre styles */
    pre {
        margin: 0;
        padding: var(--global-padding);
        overflow-x: auto;
        line-height: 1.5;
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
        background: var(--background-color);
    }

    /* Chroma syntax highlighting tokens (swapped primary/secondary for mermaid source) */
    .chroma .k { color: var(--primary-color) }
    .chroma .kc { color: var(--primary-color) }
    .chroma .kd { color: var(--chroma-keyword-decl); font-family: var(--font-stack-bold) }
    .chroma .kn { color: var(--primary-color) }
    .chroma .kp { color: var(--primary-color) }
    .chroma .kr { color: var(--primary-color) }
    .chroma .kt { color: var(--secondary-color) }
    .chroma .na { color: var(--primary-color) }
    .chroma .nb { color: var(--secondary-color); font-family: var(--font-stack-bold) }
    .chroma .nc { color: var(--primary-color) }
    .chroma .nf { color: var(--primary-color); font-family: var(--font-stack-bold) }
    .chroma .nl { color: var(--secondary-color); font-family: var(--font-stack-bold) }
    .chroma .nx { color: var(--font-color) }
    .chroma .nt { color: var(--secondary-color) }
    .chroma .nv { color: var(--secondary-color); font-family: var(--font-stack-italic) }
    .chroma .vc { color: var(--secondary-color); font-family: var(--font-stack-italic) }
    .chroma .vg { color: var(--secondary-color); font-family: var(--font-stack-italic) }
    .chroma .vi { color: var(--secondary-color); font-family: var(--font-stack-italic) }
    .chroma .l { color: var(--primary-color) }
    .chroma .s { color: var(--primary-color) }
    .chroma .sa { color: var(--primary-color) }
    .chroma .sb { color: var(--primary-color) }
    .chroma .sc { color: var(--primary-color) }
    .chroma .dl { color: var(--primary-color) }
    .chroma .sd { color: var(--primary-color) }
    .chroma .s2 { color: var(--primary-color) }
    .chroma .se { color: var(--primary-color) }
    .chroma .sh { color: var(--primary-color) }
    .chroma .si { color: var(--primary-color) }
    .chroma .sx { color: var(--primary-color) }
    .chroma .sr { color: var(--primary-color) }
    .chroma .s1 { color: var(--string-literal) }
    .chroma .ss { color: var(--primary-color) }
    .chroma .m { color: var(--secondary-color) }
    .chroma .mb { color: var(--tertiary-color) }
    .chroma .mf { color: var(--tertiary-color) }
    .chroma .mh { color: var(--tertiary-color) }
    .chroma .mi { color: var(--tertiary-color) }
    .chroma .il { color: var(--tertiary-color) }
    .chroma .mo { color: var(--tertiary-color) }
    .chroma .o { color: var(--secondary-color) }
    .chroma .ow { color: var(--secondary-color) }
    .chroma .p { color: var(--font-color-sub1) }
    .chroma .c { color: var(--chroma-comment) }
    .chroma .ch { color: var(--chroma-comment) }
    .chroma .cm { color: var(--chroma-comment) }
    .chroma .c1 { color: var(--chroma-comment) }
    .chroma .cs { color: var(--chroma-comment) }
    .chroma .cp { color: var(--secondary-color) }
    .chroma .cpf { color: var(--secondary-color) }
    .chroma .gd { color: var(--error-color) }
    .chroma .ge { text-decoration: underline }
    .chroma .gh { font-family: var(--font-stack-bold) }
    .chroma .gi { color: var(--secondary-color); font-family: var(--font-stack-bold) }
    .chroma .go { color: var(--chroma-comment) }
    .chroma .gu { font-family: var(--font-stack-bold) }
    .chroma .gl { text-decoration: underline }
`;
