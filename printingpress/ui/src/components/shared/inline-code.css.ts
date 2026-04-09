import {css} from 'lit';
import codeActionsCss from '../../styles/code-actions.css.js';

export default [codeActionsCss, css`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-bottom: var(--global-padding-double);
        
    }

    h3 {
        margin: 0;
        padding-bottom: var(--subheader-padding-bottom);
        font-size: var(--h3-size);
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        text-transform: uppercase;
        letter-spacing: var(--title-spacing);
        border-bottom: 1px dashed var(--hrcolor);
    }

    .toggle-group {
        display: flex;
        gap: 0;
        margin-left: auto;
    }

    .toggle-btn {
        background: none;
        border: 1px solid var(--hrcolor);
        color: var(--font-color-sub2);
        font-family: var(--font-stack), monospace;
        font-size: 0.75em;
        padding: 0.2em 0.6em;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .toggle-btn:first-child {
        border-right: none;
    }

    .toggle-btn.active {
        color: var(--primary-color);
        border-color: var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }

    .toggle-btn:hover:not(.active) {
        color: var(--font-color-sub1);
    }

`];
