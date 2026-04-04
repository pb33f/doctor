import {css} from 'lit';

export default css`
    :host {
        display: block;
    }
    .diagram-wrapper {
        border-radius: 0;
        overflow: hidden;
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
        padding: 0.5rem var(--global-padding);
        align-items: center;
    }
    .toolbar sl-icon-button::part(base) {
        color: var(--font-color-sub1);
    }
    .toolbar sl-icon-button::part(base):hover {
        color: var(--primary-color);
    }
    .toolbar sl-button::part(base) {
        font-family: var(--font-stack);
        font-size: 0.8rem;
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
        font-size: 0.85rem;
        color: var(--font-color-sub1);
        padding: 0.5rem var(--global-padding);
    }
    .code-section::part(content) {
        padding: 0;
    }

    /* Wide (split) layout */
    .diagram-split {
        border: 1px dashed var(--secondary-color);
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
        font-family: var(--font-stack);
        font-size: 0.85rem;
        color: var(--font-color-sub1);
        padding: 0.5rem var(--global-padding);
        border-bottom: 1px dashed var(--hrcolor);
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
        font-size: 0.8rem;
        line-height: 1.5;
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
        background: var(--background-color);
    }

    /* Chroma syntax highlighting tokens (mirrored from chroma.css for shadow DOM) */
    .chroma .k { color: var(--secondary-color) }
    .chroma .kc { color: var(--secondary-color) }
    .chroma .kd { color: var(--chroma-keyword-decl, #8be9fd); font-family: var(--font-stack-bold) }
    .chroma .kn { color: var(--secondary-color) }
    .chroma .kp { color: var(--secondary-color) }
    .chroma .kr { color: var(--secondary-color) }
    .chroma .kt { color: var(--primary-color) }
    .chroma .na { color: var(--secondary-color) }
    .chroma .nb { color: var(--primary-color); font-family: var(--font-stack-bold) }
    .chroma .nc { color: var(--secondary-color) }
    .chroma .nf { color: var(--secondary-color); font-family: var(--font-stack-bold) }
    .chroma .nl { color: var(--primary-color); font-family: var(--font-stack-bold) }
    .chroma .nx { color: var(--font-color) }
    .chroma .nt { color: var(--primary-color) }
    .chroma .nv { color: var(--primary-color); font-family: var(--font-stack-italic) }
    .chroma .vc { color: var(--primary-color); font-family: var(--font-stack-italic) }
    .chroma .vg { color: var(--primary-color); font-family: var(--font-stack-italic) }
    .chroma .vi { color: var(--primary-color); font-family: var(--font-stack-italic) }
    .chroma .l { color: var(--secondary-color) }
    .chroma .s { color: var(--secondary-color) }
    .chroma .sa { color: var(--secondary-color) }
    .chroma .sb { color: var(--secondary-color) }
    .chroma .sc { color: var(--secondary-color) }
    .chroma .dl { color: var(--secondary-color) }
    .chroma .sd { color: var(--secondary-color) }
    .chroma .s2 { color: var(--secondary-color) }
    .chroma .se { color: var(--secondary-color) }
    .chroma .sh { color: var(--secondary-color) }
    .chroma .si { color: var(--secondary-color) }
    .chroma .sx { color: var(--secondary-color) }
    .chroma .sr { color: var(--secondary-color) }
    .chroma .s1 { color: var(--string-literal, var(--terminal-text)) }
    .chroma .ss { color: var(--secondary-color) }
    .chroma .m { color: var(--primary-color) }
    .chroma .mb { color: var(--tertiary-color) }
    .chroma .mf { color: var(--tertiary-color) }
    .chroma .mh { color: var(--tertiary-color) }
    .chroma .mi { color: var(--tertiary-color) }
    .chroma .il { color: var(--tertiary-color) }
    .chroma .mo { color: var(--tertiary-color) }
    .chroma .o { color: var(--chroma-operator, #ff79c6) }
    .chroma .ow { color: var(--chroma-operator, #ff79c6) }
    .chroma .p { color: var(--font-color-sub1) }
    .chroma .c { color: var(--chroma-comment, #6272a4) }
    .chroma .ch { color: var(--chroma-comment, #6272a4) }
    .chroma .cm { color: var(--chroma-comment, #6272a4) }
    .chroma .c1 { color: var(--chroma-comment, #6272a4) }
    .chroma .cs { color: var(--chroma-comment, #6272a4) }
    .chroma .cp { color: var(--chroma-operator, #ff79c6) }
    .chroma .cpf { color: var(--chroma-operator, #ff79c6) }
    .chroma .gd { color: var(--error-color) }
    .chroma .ge { text-decoration: underline }
    .chroma .gh { font-family: var(--font-stack-bold) }
    .chroma .gi { color: var(--secondary-color); font-family: var(--font-stack-bold) }
    .chroma .go { color: var(--chroma-comment, #44475a) }
    .chroma .gu { font-family: var(--font-stack-bold) }
    .chroma .gl { text-decoration: underline }
`;
