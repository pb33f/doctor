import {css} from "lit";

export default css`
    :host {
        display: block;
        margin-top: 0;
        padding: var(--global-padding);
        border: 1px dotted var(--hrcolor);
    }

    .parameter, .extensions {
        display: grid;
        grid-template-columns: 200px minmax(220px, 320px) 130px minmax(0, 1fr);
        gap: 0 20px;
        padding: var(--global-padding) var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }

    .parameter:first-child {
        border-top: none;
    }

    .extensions {
        border-top: none;
    }
    
    .param-name-col {
        text-align: right;
        white-space: nowrap;
        min-width: 0;
    }

    .param-type-col {
        min-width: 0;
    }

    .param-desc-col {
        color: var(--font-color-sub1);
        min-width: 0;
        position: relative;
    }

    .param-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .param-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        white-space: normal;
        overflow-wrap: anywhere;
    }

    a.ref-link.param-name {
        font-family: var(--font-stack-bold), monospace;
    }

    .param-in-col {
        white-space: nowrap;
        display: flex;
        gap: 0.3rem;
    }

    .param-desc-actions {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        z-index: 1;
    }

    .param-desc-body {
        min-width: 0;
    }

    .param-desc-col.has-actions .param-desc-body {
        padding-right: 2.75rem;
    }

    .param-in-icon {
        color: var(--primary-color);
        padding-top: 1px;
    }

    .param-in {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .required-badge {
        color: var(--error-color);
        border: 1px solid var(--error-color-dimmed);
        background-color: var(--error-color-verylowalpha);
        padding: 2px var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .deprecated-badge {
        color: var(--warn-400);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        font-size: 0.8em;
    }

    .param-extras {
        grid-column: 1 / -1;
        padding-top: var(--global-padding);
    }

    .param-extensions {
        grid-column: 1 / -1;
        padding-top: var(--global-padding);
    }
    
    .param-desc-col h4 {
        margin-top: 0;
        border-bottom: 1px dotted var(--hrcolor);
        width: 100%;
        margin-bottom: var(--global-padding-double);
        padding-bottom: var(--global-padding);
    }

    .parameters-skeleton {
        display: grid;
        gap: var(--global-padding);
    }

    .parameter-skeleton-row {
        display: grid;
        grid-template-columns: 200px minmax(220px, 320px) 130px minmax(0, 1fr);
        gap: 0 20px;
        padding: var(--global-padding) var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }

    .parameter-skeleton-row:first-child {
        border-top: none;
    }

    .parameter-skeleton-name,
    .parameter-skeleton-type,
    .parameter-skeleton-in,
    .parameter-skeleton-desc {
        height: 1rem;
        background: var(--card-background-color);
        border: 1px dotted var(--hrcolor);
        box-sizing: border-box;
    }

    .parameter-skeleton-name {
        justify-self: end;
        width: 70%;
    }

    .parameter-skeleton-type {
        width: 48%;
    }

    .parameter-skeleton-in {
        width: 58%;
    }
`
