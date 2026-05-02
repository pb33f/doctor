import {css} from "lit";

export default css`
    :host {
        display: block;
        margin: 0;
    }

    .group-header {
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

    .group-header.developer {
        grid-template-columns: max-content minmax(0, 1fr) max-content;
    }

    .group-header sl-icon {
        padding-left: var(--global-padding);
    }

    .group-header span {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .group-header:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
    }

    .group-header.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }

    .chevron {
        color: var(--secondary-color);
        padding-left: var(--global-padding);
    }

    .group-header:hover .chevron,
    .group-header.active .chevron {
        color: var(--primary-color);
    }

    .group-body {
        padding: 0 0 var(--global-padding) 0;
    }

    ul {
        list-style: none;
        margin: 0 0 0 18px;
        padding: 0 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    li a {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        min-height: 22px;
        align-items: center;
        column-gap: var(--global-padding);
        padding: var(--global-padding);
        border-radius: 0;
        color: var(--font-color);
        text-decoration: none;
        border-left: 2px solid var(--background-color);
    }

    li a.developer {
        grid-template-columns: minmax(0, 1fr) max-content;
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

    .model-name {
        min-width: 0;
        font-family: var(--font-stack), monospace;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
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

    li a.active .model-name {
        font-family: var(--font-stack-bold), monospace;
    }
`
