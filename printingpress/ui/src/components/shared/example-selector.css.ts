import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: inline-block;
        margin: var(--example-margin, var(--global-padding) 0 var(--global-padding) 0);
        width: 100%;
    }

    .selector {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }

    button {
        cursor: pointer;
        background: var(--background-color);
        border: 1px dashed var(--hrcolor);
        border-radius: 0;
        padding: var(--global-padding) var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--font-color-sub1);
        transition: color 0.15s, border-color 0.15s;
    }

    button:hover {
        color: var(--primary-color);
        border-color: var(--primary-color);
    }

    /* Inline mode */

    .inline-example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .inline-selector-row {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-top: var(--global-padding-double);
    }

    .inline-example-desc {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        display: inline-block;
        border-left: 2px solid var(--secondary-color);
        padding-left: var(--global-padding-double);
        height: calc(var(--global-padding) * 3);
        padding-top: var(--global-padding);
    }

    .code-container {
        position: relative;
    }

    .floating-actions {
        position: absolute;
        top: var(--global-padding);
        right: var(--global-padding);
        z-index: 1;
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .floating-copy {
        --sl-color-primary-600: var(--primary-color);
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }

    .floating-expand::part(base) {
        color: var(--font-color-sub1);
    }
    .floating-expand::part(base):hover {
        color: var(--primary-color);
    }

    .floating-actions sl-tooltip {
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }
    .floating-actions sl-tooltip::part(body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .floating-copy::part(tooltip__body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    sl-dropdown {
        margin-top: 0;
    }
    
    pp-code-viewer {
        margin-top: var(--code-viewer-margin-top, var(--global-padding));
    }
`]
