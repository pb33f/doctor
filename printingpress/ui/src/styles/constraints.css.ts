import {css} from "lit";

export default css`
    .constraints {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.1rem 0.75rem;
        margin-top: 0.3rem;
        font-size: 0.85em;
        font-family: var(--font-stack), monospace;
    }

    .constraint-label {
        color: var(--font-color-sub2);
        text-align: right;
    }

    .constraint-value {
        color: var(--font-color-sub1);
    }

    .constraint-value code {
        color: var(--secondary-color);
    }

    .enum-section {
        grid-column: 1 / -1;
        margin-top: var(--global-padding);
    }

    .enum-grid {
        display: flex;
        flex-wrap: wrap;
        gap: var(--global-padding-half);
        margin-top: var(--global-padding);
    }

    .enum-value {
        color: var(--tertiary-color);
        font-family: var(--font-stack), monospace;
        padding: 0 var(--global-padding-half);
        white-space: nowrap;
    }
`;
