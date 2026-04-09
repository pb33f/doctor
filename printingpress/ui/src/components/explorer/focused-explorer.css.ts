import {css} from 'lit';

export default css`
    :host {
        display: block;
    }

    .explorer-wrapper {
        border-radius: 0;
        overflow: hidden;
    }

    h2 {
        margin-bottom: 0;
    }

    .explorer-container {
        height: 600px;
        border: 1px dashed var(--secondary-color);
        overflow: hidden;
    }

    /* Toolbar — same styles as class-diagram */
    .toolbar {
        display: flex;
        gap: var(--global-padding);
        padding: var(--global-padding) 0 var(--global-padding) 0;
        align-items: center;
    }
    .toolbar sl-tooltip {
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }
    .toolbar sl-tooltip::part(body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }
    .toolbar sl-icon-button::part(base) {
        color: var(--font-color-sub1);
    }
    .toolbar sl-icon-button::part(base):hover {
        color: var(--primary-color);
    }
    .hide-toggle.hidden::part(base) {
        color: var(--error-color);
    }
    .toolbar sl-button::part(base) {
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
        gap: 0.35rem;
    }
    .toolbar sl-button::part(base):hover {
        color: var(--primary-color);
    }
    .toolbar sl-button::part(label) {
        padding: 0;
    }
`;
