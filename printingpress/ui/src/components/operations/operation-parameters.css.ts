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
        grid-template-columns: 200px 200px 150px 1fr;
        gap: 0 20px;
        padding: var(--global-padding) var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }
    
    pp-raw-viewer-btn { 
        float: right;
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
    }

    .param-type-col {
        white-space: nowrap;
    }

    .param-desc-col {
        color: var(--font-color-sub1);
    }

    .param-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .param-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        white-space: nowrap;
    }

    a.ref-link.param-name {
        font-family: var(--font-stack-bold), monospace;
    }

    .param-in-col {
        white-space: nowrap;
        display: flex;
        gap: 0.3rem;
    }

    .param-in-icon {
        color: var(--primary-color);
        padding-top: 1px;
    }

    .param-in {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .required-badge {
        color: var(--error-color);
        border: 1px solid var(--error-color-dimmed);
        background-color: var(--error-color-verylowalpha);
        padding: 2px var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .deprecated-badge {
        color: var(--warn-400);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
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
`
