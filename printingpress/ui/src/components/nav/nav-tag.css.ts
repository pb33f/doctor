import {css} from "lit";

export default css`
    :host {
        display: block;
        margin: 0;
    }

    .tag-header {
        display: grid;
        grid-template-columns: max-content minmax(0, 1fr);
        align-items: center;
        column-gap: var(--global-padding);
        cursor: pointer;
        padding: var(--global-padding);
        padding-left: 0;
        font-family: var(--font-stack), monospace;
        color: var(--font-color);
    }

    .tag-header.developer {
        grid-template-columns: max-content minmax(0, 1fr) max-content;
    }

    .tag-header sl-icon {
        padding-left: var(--global-padding);
    }

    .tag-name {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .tag-header:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
    }

    .tag-header.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }
    
    .tag-body {
        padding: var(--global-padding) 0 0 0;
    }
    
    .chevron {
        color: var(--secondary-color);
        padding-left: var(--global-padding);
    }

    .tag-header:hover .chevron,
    .tag-header.active .chevron {
        color: var(--primary-color);
    }

    .tag-description {
        padding: var(--global-padding) var(--global-padding) var(--global-padding) 22px;
        font-size: var(--smaller-font);
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
    }


    ul {
        list-style: none;
        margin: 0 0 0 18px;
        padding: 0 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    li a {
        display: grid;
        grid-template-columns: minmax(0, 1fr) max-content;
        align-items: baseline;
        column-gap: var(--global-padding);
        padding: var(--global-padding);
        border-radius: 0;
        color: var(--font-color);
        text-decoration: none;
        border-left: 2px solid var(--background-color);
        font-size: 0.9rem;
    }

    li a.developer {
        grid-template-columns: minmax(0, 1fr) max-content max-content;
    }

    li a:hover {
        background: var(--primary-color-verylowalpha);
        text-decoration: none;
        border-left: 2px solid var(--secondary-color);
    }

    li a.active {
        background: var(--primary-color-verylowalpha);
        border-left: 2px solid var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
    }
    
    .op-title {
        min-width: 0;
        font-family: var(--font-stack), monospace;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
    }

    pb33f-http-method {
        justify-self: end;
    }

    .violation-badges {
        display: inline-flex;
        justify-self: end;
        justify-content: flex-end;
        align-items: center;
        gap: 0.25rem;
        min-width: 0;
    }

    .violation-badge {
        justify-self: end;
        font-variant-numeric: tabular-nums;
    }

    .violation-badge::part(base) {
        min-width: 1.35rem;
        height: 1.35rem;
        padding: 0 0.35rem;
        border-width: 1px;
        border-style: solid;
        border-radius: 0;
        background: transparent;
        font-family: var(--font-stack-bold), monospace;
    }

    li a .violation-badge {
        margin-left: 0;
    }

    .violation-badge.error::part(base) {
        border-color: var(--error-color, #ff5572);
        color: var(--error-color, #ff5572);
    }

    .violation-badge.warn::part(base) {
        border-color: var(--warn-color, #ffca5f);
        color: var(--warn-color, #ffca5f);
    }

    .violation-badge.info::part(base) {
        border-color: var(--secondary-color);
        color: var(--secondary-color);
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* global html[theme] override in printing-press.css cannot reach into shadow DOM,
       so replicate the monochrome override here via :host-context */
    :host-context(html[theme="light"]) pb33f-http-method,
    :host-context(html[theme="tektronix"]) pb33f-http-method {
        --http-get-color: var(--font-color);
        --http-post-color: var(--font-color);
        --http-put-color: var(--font-color);
        --http-delete-color: var(--font-color);
        --http-patch-color: var(--font-color);
        --http-options-color: var(--font-color);
        --http-head-color: var(--font-color);
        --http-trace-color: var(--font-color);
        --http-query-color: var(--font-color);
    }

    li a.active .op-title {
        font-family: var(--font-stack-bold), monospace;
    }
    
    .children {
        margin-left: 18px;
        margin-bottom: var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    .deprecated {
        text-decoration: line-through;
        opacity: 0.5;
    }
`
