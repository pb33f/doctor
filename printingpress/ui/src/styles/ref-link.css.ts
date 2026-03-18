import {css} from "lit";

export default css`
    a.ref-link,
    a.ref-link:hover {
        color: var(--terminal-text);
        font-family: var(--font-stack), monospace;
    }

    a.ref-link {
        text-decoration: none;
    }

    a.ref-link:hover {
        text-decoration: underline;
    }
`;
