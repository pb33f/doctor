import {css} from "lit";
import codeActionsCss from '../../styles/code-actions.css.js';

export default [codeActionsCss, css`
    :host {
        display: block;
    }

    sl-drawer {
        --size: 50vw;
    }

    sl-drawer::part(panel) {
        background: var(--background-color);
        border-left: var(--global-padding) solid var(--secondary-color);
    }

    sl-drawer::part(header) {
        display: none;
    }

    sl-drawer::part(body) {
        padding: 0;
        display: flex;
        flex-direction: column;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-lowalpha) var(--background-color);
    }

    .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: var(--background-color);
        border-bottom: 1px solid var(--hrcolor);
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .drawer-title {
        margin: 0;
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: var(--title-spacing);
        color: var(--primary-color);
    }

    .rich-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .component-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .drawer-component-title {
        font-family: var(--font-stack-bold), monospace;
        font-size: 1.4rem;
        color: var(--font-color);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .close-btn {
        color: var(--font-color-sub1);
        font-size: 1rem;
    }

    .code-container {
        flex: 1;
    }

    pp-code-viewer {
        width: 100%;
    }

    .format-toggle {
        display: flex;
        gap: 0.5rem;
    }

    .format-toggle button {
        cursor: pointer;
        background: none;
        border: 1px dashed var(--hrcolor);
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        padding: 0.25rem 0.75rem;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        transition: color 0.15s, border-color 0.15s;
    }

    .format-toggle button.active {
        color: var(--primary-color);
        border-color: var(--primary-color);
    }

    .format-toggle button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`]
