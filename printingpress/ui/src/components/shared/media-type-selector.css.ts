import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: block;
    }

    .media-type-ref {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        padding: 0 0 var(--global-padding);
    }

    .media-type-label {
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .array-type {
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
    }

    .media-type-extensions {
        margin-top: var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
        padding-top: var(--global-padding-double);
    }

    .media-type-extensions h4 {
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: var(--title-spacing);
        margin: 0 0 var(--global-padding) 0;
    }

    /* Split panel (wide layout) */
    .schema-split {
        --divider-width: 2px;
        --divider-hit-area: 12px;
        --min: min(44rem, 58%);
        --max: calc(100% - min(28rem, 40%));
        margin-top: var(--global-padding);
        overflow: hidden;
        grid-template-rows: 1fr;
    }
    .schema-split.example-hidden {
        --max: calc(100% - 2.75rem);
    }
    .schema-split::part(divider) {
        background-color: var(--secondary-color);
    }
    .schema-split sl-icon[slot="divider"] {
        position: absolute;
        left: 2px;
        border-radius: 0;
        background: var(--secondary-color);
        color: var(--background-color);
        padding: 0;
        width: 10px;
        height: 40px;
    }
    .split-pane {
        height: 100%;
        min-width: 0;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-dimmer) transparent;
    }
    .split-pane::-webkit-scrollbar { width: 6px; }
    .split-pane::-webkit-scrollbar-track { background: transparent; }
    .split-pane::-webkit-scrollbar-thumb { background: var(--secondary-color-dimmer); border-radius: 0; }
    .schema-props-pane {
        padding: 0 var(--global-padding-double) var(--global-padding-double) 0;
    }
    .schema-example-pane {
        padding: 0 0 0 var(--global-padding-double);
        --code-accent-color: var(--primary-color);
        --code-border-color: var(--primary-color-lowalpha);
        --example-margin: 0;
        --code-viewer-margin-top: 0;
    }
    .example-hidden .schema-example-pane {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        min-width: 2.5rem;
        padding: 0;
        overflow: hidden;
    }
    .example-restore-tooltip {
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }
    .example-restore-tooltip::part(body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }
    .example-restore::part(base) {
        color: var(--font-color-sub1);
        font-size: 1rem;
        padding: var(--global-padding-half);
    }
    .example-restore::part(base):hover {
        color: var(--primary-color);
    }
`]
