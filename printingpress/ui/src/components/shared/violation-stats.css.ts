import {css} from 'lit';

export default css`
    :host {
        display: block;
        margin: var(--global-padding) 0 var(--global-padding-double);
        --violation-stat-height: 50px;
    }

    .stats {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: var(--global-padding);
    }

    .stat {
        display: grid;
        grid-template-columns: auto auto auto;
        align-items: center;
        gap: var(--global-padding);
        box-sizing: border-box;
        height: 50px;
        padding: 0 var(--global-padding);
        border: 1px solid var(--hrcolor);
        font-family: var(--font-stack), monospace;
    }



    .stat span.label {
        font-family: var(--font-stack-bold), monospace;
        font-variant-numeric: tabular-nums;
    }

    .stat span.violation {
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    sl-icon {
        font-size: 2rem;
    }

    .err sl-icon,
    .err span {
        color: var(--error-color);
    }

    .warn sl-icon,
    .warn span {
        color: var(--warn-color);
    }

    .info sl-icon,
    .info span {
        color: var(--secondary-color);
    }

    .details-button {
        align-self: center;
    }

    .details-button::part(base) {
        height: var(--violation-stat-height);
        line-height: 48px;
        border: 1px solid var(--primary-color);
        border-radius: 0;
        background: transparent;
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
    }

    .details-button::part(base):hover {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--background-color);
    }

    .details-button::part(base):active {
        border-color: var(--warn-color);
        background: var(--warn-color);
        color: var(--background-color);
    }

    .details-button::part(prefix) {
        color: inherit;
    }
`;
