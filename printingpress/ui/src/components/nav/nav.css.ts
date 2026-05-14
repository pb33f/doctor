import {css} from "lit";

export default css`
    :host {
        display: block;
        padding: var(--global-padding);
        font-family: var(--font-stack), monospace;
    }

    .nav-home {
        display: flex;
        align-items: center;
        padding: var(--global-padding) 0 var(--global-padding) 0;
        font-family: var(--font-stack), monospace;
        color: var(--font-color);
        text-decoration: none;
        cursor: pointer;
    }

    .docs-expiry {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 0 0 var(--global-padding) 0;
        padding: calc(var(--global-padding) * 0.75) var(--global-padding);
        border: 1px solid var(--warning-color);
        border-left: var(--global-padding) solid var(--warning-color);
        background: var(--background-color);
        color: var(--warning-color);
        font-family: var(--font-stack), monospace;
        line-height: 1.2;
        text-transform: uppercase;
        white-space: normal;
        overflow-wrap: break-word;
    }

    .docs-expiry.critical {
        color: var(--error-color);
        border-color: var(--error-color);
        border-left-color: var(--error-color);
        animation: blink-fade 1s ease-in-out infinite;
    }

    .docs-expiry.expired {
        color: var(--error-color);
        border-color: var(--error-color);
        border-left-color: var(--error-color);
        animation: none;
    }

    .docs-expiry.critical strong,
    .docs-expiry.expired strong {
        color: var(--error-color);
    }

    .host-archive-controls {
        container-type: inline-size;
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        margin: 0 0 var(--global-padding) 0;
        padding: 0;
        border: 1px solid var(--secondary-color);
        background: var(--background-color);
    }

    .host-archive-control-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: var(--global-padding);
        align-items: center;
        min-width: 0;
        padding: var(--global-padding);
    }

    .host-archive-controls-title {
        box-sizing: border-box;
        width: 100%;
        padding: var(--global-padding);
        background: var(--secondary-color-lowalpha);
        color: var(--font-color);
        font-family: var(--font-stack), monospace;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .archive-format-dropdown {
        padding-top: 4px;
    }

    .host-archive-controls .archive-format-dropdown,
    .host-archive-controls .archive-format-trigger {
        width: 100%;
        min-width: 0;
    }

    .host-archive-controls .archive-download-button {
        width: 100%;
        margin-left: 0;
    }

    .host-archive-controls .archive-option-tooltip {
        display: block;
        width: 100%;
        min-width: 0;
    }

    .host-archive-controls .archive-option-tooltip sl-checkbox,
    .host-archive-controls > sl-checkbox {
        color: var(--font-color);
        width: 100%;
        text-transform: uppercase;
    }

    .host-archive-controls sl-checkbox::part(base) {
        align-items: center;
    }

    .host-archive-controls sl-checkbox::part(label) {
        font-family: var(--font-stack), monospace;
        line-height: 1;
        white-space: normal;
        overflow-wrap: anywhere;
    }

    .host-archive-controls .archive-format-trigger::part(base),
    .host-archive-controls .archive-download-button::part(base) {
        width: 100%;
        padding: 0 var(--global-padding);
        border-radius: 0;
        background: var(--background-color);
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
    }

    .host-archive-controls .archive-format-trigger::part(base) {
        border-color: var(--primary-color);
        color: var(--primary-color);
    }

    .host-archive-controls .archive-format-trigger::part(base):hover {
        background: var(--primary-color);
        color: var(--background-color);
    }

    .host-archive-controls .archive-download-button::part(base) {
        min-width: 4.75rem;
        border-color: var(--warn-color);
        color: var(--warn-color);
    }

    .host-archive-controls .archive-download-button::part(base):hover {
        background: var(--warn-color);
        color: var(--background-color);
    }

    .host-archive-controls sl-menu {
        border: 1px solid var(--primary-color);
        border-radius: 0;
        background: var(--background-color);
    }

    .host-archive-controls sl-menu::part(base) {
        border-radius: 0;
        background: var(--background-color);
    }

    .host-archive-controls sl-menu-item::part(base) {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        line-height: 1.1;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        --sl-color-neutral-100: var(--secondary-color-lowalpha);
        --sl-color-neutral-200: var(--secondary-color-lowalpha);
    }

    .host-archive-controls sl-menu-item::part(checked-icon) {
        color: var(--primary-color);
    }

    .host-archive-controls sl-button::part(label) {
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    @container (min-width: 22rem) {
        .host-archive-control-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--global-padding-double);
        }

        .host-archive-controls .archive-format-dropdown,
        .host-archive-controls .archive-download-button {
            grid-column: 1 / -1;
        }
    }

    @container (min-width: 34rem) {
        .host-archive-controls .archive-format-dropdown {
            grid-column: 1;
        }

        .host-archive-controls .archive-download-button {
            grid-column: 2;
        }
    }

    @keyframes blink-fade {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
    }

    .nav-home-chevron {
        color: var(--secondary-color);
        margin-right: var(--global-padding);
        padding-left: var(--global-padding);
    }

    .nav-home:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
        text-decoration: none;
    }

    .nav-home:hover .nav-home-chevron {
        color: var(--primary-color);
    }

    .nav-home.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }

    .nav-home.active .nav-home-chevron {
        color: var(--primary-color);
    }

    .nav-section {
        margin-bottom: var(--global-padding);
    }

    h4 {
        text-transform: uppercase;
        letter-spacing: var(--title-spacing);
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        margin: 0 0 var(--global-padding) 0;
        padding-bottom: var(--global-padding);
        border-bottom: 1px dashed var(--primary-color-lowalpha);
    }

    .nav-models-section {
        margin-top: var(--global-padding-double);
    }

    .nav-webhooks-section {
        margin-top: var(--global-padding-double);
    }

    .pp-nav-fallback {
        display: block;
        font-family: var(--font-stack), monospace;
    }

    .pp-nav-fallback-home {
        padding: var(--global-padding) 0;
        color: var(--font-color);
        letter-spacing: var(--label-spacing);
    }

    .pp-nav-fallback-section {
        margin-top: var(--global-padding-double);
    }

    .pp-nav-fallback-list {
        display: grid;
        gap: 0.75rem;
    }

    .pp-nav-fallback-row {
        height: 1rem;
        background: var(--card-background-color);
        border: 1px dotted var(--hrcolor);
    }

    .nav-operations-section {
        margin-top: var(--global-padding-double);
    }

    .nav-models-link {
        display: block;
        padding: var(--global-padding);
        color: var(--font-color-sub1);
        text-decoration: none;
    }

    .nav-models-link:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
        text-decoration: none;
    }

`
