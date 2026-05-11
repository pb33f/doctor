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
        font-size: 0.9rem;
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

    @keyframes blink-fade {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
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
        font-size: 1.3rem;
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
        font-size: 0.95rem;
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
