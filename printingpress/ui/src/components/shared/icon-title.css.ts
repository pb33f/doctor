import {css} from 'lit';

export default css`
    :host {
        display: flex;
        align-items: center;
        gap: var(--global-padding);
    }

    h1, h2, h3, h4 {
        margin: 0;
        padding: 0;
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
    }
`;
