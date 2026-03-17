import {css} from "lit";

export default css`
    :host {
        display: inline;
        position: relative;
    }

    .trigger {
        display: inline;
    }

    sl-popup {
        z-index: 10000;
    }

    sl-popup::part(popup) {
        z-index: 10000;
    }

    .pp-ref-popover-content {
        max-width: 500px;
        max-height: 400px;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--background-color);
        border: 1px dashed var(--secondary-color);
        padding: 0.75rem;
        text-align: left;
    }

    .popover-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .type-badge {
        color: var(--secondary-color);
        background: var(--secondary-color-very-lowalpha);
        border: 1px solid var(--secondary-color-dimmer);
        padding: 0.1em 0.4em;
        text-transform: uppercase;
        font-family: var(--font-stack-bold);
        letter-spacing: 0.05em;
        font-size: 0.75em;
    }

    .component-name {
        font-family: var(--font-stack-bold);
        color: var(--font-color);
    }

    .popover-body {
        border-top: 1px dotted var(--hrcolor);
        padding-top: 0.5rem;
    }

    .popover-example {
        border-top: 1px dotted var(--hrcolor);
        margin-top: 0.5rem;
        padding-top: 0.5rem;
    }

    .example-label {
        font-family: var(--font-stack);
        color: var(--font-color-sub2);
        text-transform: uppercase;
        font-size: 0.8em;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
        text-align: left;
    }
`
