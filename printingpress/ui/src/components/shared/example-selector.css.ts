import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';
import codeActionsCss from '../../styles/code-actions.css.js';

export default [dropdownCss, codeActionsCss, css`
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
        letter-spacing: var(--label-spacing);
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
        letter-spacing: var(--label-spacing);
    }

    .inline-selector-row {
        display: flex;
        align-items: flex-start;
        gap: var(--global-padding-double);
        margin-top: var(--global-padding-double);
    }

    .inline-example-desc {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        display: block;
        flex: 1;
        min-width: 0;
        border-left: 2px solid var(--secondary-color);
        padding-left: var(--global-padding-double);
        padding-top: 0;
    }

    sl-dropdown {
        margin-top: 0;
    }
    
    pp-code-viewer {
        margin-top: var(--code-viewer-margin-top, var(--global-padding));
    }
`]
