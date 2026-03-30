import {css} from "lit";

export default css`
    :host {
        display: block;
        position: fixed;
        top: calc(var(--pp-header-height) + 85px);
        right: 10px;
        z-index: 5;
        width: 438px;
    }

    :host([nav-hidden]) {
        width: 22px;
    }

    .nav-container {
        display: flex;
        flex-direction: row;
        border: 1px solid var(--secondary-color);
        background: var(--background-color);
        max-height: 60vh;
    }

    .nav-container:has(.collapse-tab:hover) {
        border-color: var(--primary-color);
    }

    .nav-container:has(.collapse-tab:active) {
        border-color: var(--warn-color);
    }

    nav {
        flex: 1;
        min-width: 0;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        padding: var(--global-padding-double);
    }

    :host([nav-hidden]) nav {
        display: none;
    }

    .collapse-tab {
        width: 20px;
        font-size: 55px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--secondary-color);
        cursor: pointer;
    }

    .collapse-tab:hover {
        background: var(--primary-color);
    }

    .collapse-tab:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
    }

    .collapse-tab sl-icon {
        color: var(--background-color);
        font-size: 0.7em;
    }

    .collapse-tab.flashing {
        animation: flash-warn 250ms ease forwards;
    }

    @keyframes flash-warn {
        0% { background: var(--warn-color); }
        100% { background: var(--secondary-color); }
    }

    .nav-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        cursor: pointer;
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        letter-spacing: 0.05em;
        word-break: break-all;
    }

    .nav-header sl-icon {
        flex-shrink: 0;
        color: var(--secondary-color);
    }

    .nav-sections {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
    }

    .nav-sections > li {
        padding: 0.2rem 0;
    }

    .nav-sections a {
        color: var(--font-color-sub1);
        text-decoration: none;
        cursor: pointer;
        font-family: var(--font-stack), monospace;
        font-size: 0.85rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }

    .nav-sections a:hover {
        color: var(--primary-color);
        text-decoration: underline;
    }

    .nav-sections a.active {
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
    }

    .nav-children {
        list-style: none;
        padding-left: 0.75rem;
        margin: 0;
    }

    .nav-children li {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.1rem 0;
    }

    .nav-children sl-icon {
        font-size: 0.6em;
        color: var(--secondary-color);
        flex-shrink: 0;
    }

    a.status-2xx, a.status-2xx:hover { color: var(--terminal-text); }
    a.status-3xx, a.status-3xx:hover { color: var(--primary-color); }
    a.status-4xx, a.status-4xx:hover { color: var(--warn-color); }
    a.status-5xx, a.status-5xx:hover { color: var(--error-color); }
`
