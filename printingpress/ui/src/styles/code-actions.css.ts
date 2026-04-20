import {css} from 'lit';

export default css`
    .code-container {
        position: relative;
    }

    .floating-actions {
        position: absolute;
        top: var(--global-padding-half);
        right: 0px;
        z-index: 1;
        display: flex;
        gap: var(--global-padding-half);
        align-items: center;
    }

    .floating-copy {
        position: absolute;
        top: 0;
        right: var(--global-padding);
        z-index: 1;
    }

    .floating-actions sl-icon-button::part(base),
    .floating-copy sl-icon-button::part(base) {
        color: var(--font-color-sub1);
        font-size: 1rem;
        padding: var(--global-padding-half);
    }

    .floating-actions sl-icon-button::part(base):hover,
    .floating-copy sl-icon-button::part(base):hover,
    .floating-expand::part(base):hover {
        color: var(--primary-color);
    }

    .floating-expand::part(base) {
        color: var(--font-color-sub1);
    }

    .floating-actions sl-tooltip,
    .floating-copy {
        --sl-color-primary-600: var(--primary-color);
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }

    .floating-actions sl-tooltip::part(body),
    .floating-copy::part(body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }
`;
