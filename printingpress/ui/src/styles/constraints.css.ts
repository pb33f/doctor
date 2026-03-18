import {css} from "lit";

export default css`
    .constraints {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.1rem 0.75rem;
        margin-top: 0.3rem;
        font-size: 0.85em;
        font-family: var(--font-stack);
    }

    .constraint-label {
        color: var(--font-color-sub2);
        text-align: right;
    }

    .constraint-value {
        color: var(--font-color-sub1);
    }

    .constraint-value code {
        color: var(--warn-400);
    }

    .enum-value {
        color: var(--warn-400);
        font-family: var(--font-stack);
    }
`;
